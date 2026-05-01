package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"devbhoomi/server/internal/config"
	"devbhoomi/server/internal/database"
	"devbhoomi/server/internal/handler"
	"devbhoomi/server/internal/middleware"
	"devbhoomi/server/internal/repository"
	"devbhoomi/server/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	pool, err := database.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database error: %v", err)
	}
	defer pool.Close()

	if err := database.RunMigrations(ctx, pool); err != nil {
		log.Fatalf("migration error: %v", err)
	}
	log.Println("migrations ok")

	// ── repositories ──────────────────────────────────────────────────────────
	userRepo    := repository.NewUserRepository(pool)
	productRepo := repository.NewProductRepository(pool)
	cartRepo    := repository.NewCartRepository(pool)
	orderRepo   := repository.NewOrderRepository(pool)

	// ── services ──────────────────────────────────────────────────────────────
	authSvc    := service.NewAuthService(userRepo, cfg.JWTSecret, cfg.AccessTokenTTL, cfg.RefreshTokenTTL)
	productSvc := service.NewProductService(productRepo)
	cartSvc    := service.NewCartService(cartRepo, productRepo)

	// ── handlers ──────────────────────────────────────────────────────────────
	authH    := handler.NewAuthHandler(authSvc)
	productH := handler.NewProductHandler(productSvc)
	cartH    := handler.NewCartHandler(cartSvc)
	b2bH     := handler.NewB2BHandler(productSvc, cartSvc)
	adminH   := handler.NewAdminHandler(productSvc, orderRepo, userRepo)
	userH    := handler.NewUserHandler(orderRepo, userRepo, cartRepo)

	// ── router ────────────────────────────────────────────────────────────────
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.CORS(cfg.AllowedOrigins))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "time": time.Now().UTC()})
	})

	v1 := r.Group("/api/v1")

	// Auth (public)
	auth := v1.Group("/auth")
	{
		auth.POST("/register", authH.Register)
		auth.POST("/login", authH.Login)
		auth.POST("/refresh", authH.Refresh)
		auth.POST("/logout", authH.Logout)
	}

	// Admin auth (separate endpoint used by admin panel)
	v1.POST("/admin/auth/login", authH.AdminLogin)

	// Products (public)
	products := v1.Group("/products")
	{
		products.GET("", productH.List)
		products.GET("/search", productH.Search)
		products.GET("/:slug", productH.Get)
	}

	// Cart (optional auth — guest + authenticated)
	optAuth := middleware.OptionalAuth(cfg.JWTSecret)
	cart := v1.Group("/cart", optAuth)
	{
		cart.GET("", cartH.Get)
		cart.POST("/items", cartH.AddItem)
		cart.PUT("/items/:id", cartH.UpdateItem)
		cart.DELETE("/items/:id", cartH.RemoveItem)
	}

	// B2B routes (require auth + wholesaler/admin role)
	reqAuth := middleware.RequireAuth(cfg.JWTSecret)
	b2b := v1.Group("/b2b", reqAuth, middleware.RequireRoles("wholesaler", "admin"))
	{
		b2b.GET("/catalog", b2bH.Catalog)
		b2b.POST("/quick-order", b2bH.QuickOrder)
		b2b.POST("/merge-cart", b2bH.MergeCart)
	}

	// Cart merge after login (any authenticated user)
	v1.POST("/cart/merge", reqAuth, func(c *gin.Context) {
		b2bH.MergeCart(c)
	})

	// User routes (require auth)
	v1.GET("/auth/me", reqAuth, userH.GetProfile)
	v1.PUT("/auth/me", reqAuth, userH.UpdateProfile)
	v1.GET("/orders/mine", reqAuth, userH.GetMyOrders)

	// Place order — auth optional (guests can order too)
	// Authenticated users: items loaded from server-side cart
	// Guest users: items must be provided in request body
	v1.POST("/orders", optAuth, userH.PlaceOrder)

	// Admin routes (require auth + admin role)
	admin := v1.Group("/admin", reqAuth, middleware.RequireRole("admin"))
	{
		admin.GET("/dashboard/stats", adminH.DashboardStats)

		admin.GET("/products", adminH.ListProducts)
		admin.GET("/products/:id", adminH.GetProduct)
		admin.POST("/products", adminH.CreateProduct)
		admin.PUT("/products/:id", adminH.UpdateProduct)
		admin.DELETE("/products/:id", adminH.DeleteProduct)
		admin.PUT("/products/:id/inventory", adminH.UpdateInventory)

		admin.GET("/orders", adminH.ListOrders)
		admin.PUT("/orders/:id/status", adminH.UpdateOrderStatus)

		admin.GET("/customers", adminH.ListCustomers)

		admin.GET("/wholesalers", adminH.ListWholesalers)
		admin.PUT("/wholesalers/:id/approve", adminH.ApproveWholesaler)
	}

	// ── server ────────────────────────────────────────────────────────────────
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("server listening on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("listen: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("shutting down...")
	ctx2, cancel2 := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel2()
	_ = srv.Shutdown(ctx2)
	log.Println("server stopped")
}
