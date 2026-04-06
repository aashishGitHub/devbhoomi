package handler

import (
	"net/http"

	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/middleware"
	"devbhoomi/server/internal/service"

	"github.com/gin-gonic/gin"
)

type B2BHandler struct {
	productSvc *service.ProductService
	cartSvc    *service.CartService
}

func NewB2BHandler(productSvc *service.ProductService, cartSvc *service.CartService) *B2BHandler {
	return &B2BHandler{productSvc: productSvc, cartSvc: cartSvc}
}

// Catalog returns all active products with B2B pricing applied to each tier.
func (h *B2BHandler) Catalog(c *gin.Context) {
	resp, err := h.productSvc.List(c.Request.Context(), model.ProductSearchParams{
		Page:    1,
		PerPage: 100,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load catalog"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// QuickOrder processes a multi-SKU order submission from the Quick Order Matrix.
func (h *B2BHandler) QuickOrder(c *gin.Context) {
	var req struct {
		Items []struct {
			ProductID string `json:"product_id" binding:"required"`
			Quantity  int    `json:"quantity"   binding:"required,min=1"`
		} `json:"items" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	userID, _ := c.Get(middleware.CtxUserID)
	uid := userID.(string)

	for _, item := range req.Items {
		if _, err := h.cartSvc.AddItem(
			c.Request.Context(), uid, "", item.ProductID, item.Quantity, true,
		); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to add " + item.ProductID + ": " + err.Error()})
			return
		}
	}

	resp, err := h.cartSvc.Get(c.Request.Context(), uid, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load cart"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// MergeCart merges a guest session cart into the authenticated user's cart.
func (h *B2BHandler) MergeCart(c *gin.Context) {
	var req struct {
		SessionID string `json:"session_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	userID, _ := c.Get(middleware.CtxUserID)
	uid := userID.(string)

	if err := h.cartSvc.MergeOnLogin(c.Request.Context(), req.SessionID, uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Cart merge failed"})
		return
	}

	resp, err := h.cartSvc.Get(c.Request.Context(), uid, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load cart"})
		return
	}
	c.JSON(http.StatusOK, resp)
}
