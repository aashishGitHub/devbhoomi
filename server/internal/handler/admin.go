package handler

import (
	"math"
	"net/http"
	"strings"

	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/repository"
	"devbhoomi/server/internal/service"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	productSvc *service.ProductService
	orderRepo  *repository.OrderRepository
	userRepo   *repository.UserRepository
}

func NewAdminHandler(
	productSvc *service.ProductService,
	orderRepo *repository.OrderRepository,
	userRepo *repository.UserRepository,
) *AdminHandler {
	return &AdminHandler{
		productSvc: productSvc,
		orderRepo:  orderRepo,
		userRepo:   userRepo,
	}
}

// ── Products ──────────────────────────────────────────────────────────────────

func (h *AdminHandler) ListProducts(c *gin.Context) {
	params := model.ProductSearchParams{
		Q:        c.Query("q"),
		Category: c.Query("category"),
		Page:     parseIntQuery(c, "page", 1),
		PerPage:  parseIntQuery(c, "per_page", 50),
	}

	resp, err := h.productSvc.ListAll(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load products"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *AdminHandler) GetProduct(c *gin.Context) {
	id := c.Param("id")
	product, err := h.productSvc.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func (h *AdminHandler) CreateProduct(c *gin.Context) {
	var req struct {
		Name        string                 `json:"name" binding:"required"`
		Slug        string                 `json:"slug"`
		Category    string                 `json:"category" binding:"required,oneof=sacred foods wellness"`
		Subcategory string                 `json:"subcategory"`
		Description string                 `json:"description"`
		PriceINR    float64                `json:"price_inr" binding:"required"`
		PriceUSD    *float64               `json:"price_usd"`
		Variants    []model.ProductVariant  `json:"variants"`
		B2BPricing  []model.B2BPricingTier `json:"b2b_pricing"`
		Traceability *model.Traceability   `json:"traceability"`
		ScientificAttributes map[string]interface{} `json:"scientific_attributes"`
		Images      []string               `json:"images"`
		SEO         *model.ProductSEO      `json:"seo"`
		InventoryRetail    int             `json:"inventory_retail"`
		InventoryWholesale int             `json:"inventory_wholesale"`
		MOQWholesale       *int            `json:"moq_wholesale"`
		WeightKG    *float64               `json:"weight_kg"`
		DimensionsCM *model.Dimensions     `json:"dimensions_cm"`
		Status      string                 `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	slug := req.Slug
	if slug == "" {
		slug = slugify(req.Name)
	}

	status := model.ProductStatus(req.Status)
	if status == "" {
		status = model.StatusActive
	}

	p := &model.Product{
		Name:                 req.Name,
		Slug:                 slug,
		Category:             model.ProductCategory(req.Category),
		Subcategory:          req.Subcategory,
		Description:          req.Description,
		Price:                map[string]float64{"inr": req.PriceINR},
		Variants:             req.Variants,
		B2BPricing:           req.B2BPricing,
		Traceability:         req.Traceability,
		ScientificAttributes: req.ScientificAttributes,
		Images:               req.Images,
		SEO:                  req.SEO,
		Inventory:            map[string]int{"retail": req.InventoryRetail, "wholesale": req.InventoryWholesale},
		WeightKG:             req.WeightKG,
		DimensionsCM:         req.DimensionsCM,
		Status:               status,
	}
	if req.PriceUSD != nil {
		p.Price["usd"] = *req.PriceUSD
	}
	if req.MOQWholesale != nil {
		p.MOQ = map[string]int{"wholesale": *req.MOQWholesale}
	}

	if err := h.productSvc.Create(c.Request.Context(), p); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create product: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, p)
}

func (h *AdminHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")

	existing, err := h.productSvc.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		return
	}

	var req struct {
		Name        *string                 `json:"name"`
		Slug        *string                 `json:"slug"`
		Category    *string                 `json:"category"`
		Subcategory *string                 `json:"subcategory"`
		Description *string                 `json:"description"`
		PriceINR    *float64                `json:"price_inr"`
		PriceUSD    *float64                `json:"price_usd"`
		Variants    *[]model.ProductVariant  `json:"variants"`
		B2BPricing  *[]model.B2BPricingTier `json:"b2b_pricing"`
		Traceability *model.Traceability    `json:"traceability"`
		ScientificAttributes *map[string]interface{} `json:"scientific_attributes"`
		Images      *[]string               `json:"images"`
		SEO         *model.ProductSEO       `json:"seo"`
		InventoryRetail    *int             `json:"inventory_retail"`
		InventoryWholesale *int             `json:"inventory_wholesale"`
		MOQWholesale       *int             `json:"moq_wholesale"`
		WeightKG    *float64                `json:"weight_kg"`
		DimensionsCM *model.Dimensions      `json:"dimensions_cm"`
		Status      *string                 `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if req.Name != nil {
		existing.Name = *req.Name
	}
	if req.Slug != nil {
		existing.Slug = *req.Slug
	}
	if req.Category != nil {
		existing.Category = model.ProductCategory(*req.Category)
	}
	if req.Subcategory != nil {
		existing.Subcategory = *req.Subcategory
	}
	if req.Description != nil {
		existing.Description = *req.Description
	}
	if req.PriceINR != nil {
		existing.Price["inr"] = *req.PriceINR
	}
	if req.PriceUSD != nil {
		existing.Price["usd"] = *req.PriceUSD
	}
	if req.Variants != nil {
		existing.Variants = *req.Variants
	}
	if req.B2BPricing != nil {
		existing.B2BPricing = *req.B2BPricing
	}
	if req.Traceability != nil {
		existing.Traceability = req.Traceability
	}
	if req.ScientificAttributes != nil {
		existing.ScientificAttributes = *req.ScientificAttributes
	}
	if req.Images != nil {
		existing.Images = *req.Images
	}
	if req.SEO != nil {
		existing.SEO = req.SEO
	}
	if req.InventoryRetail != nil {
		existing.Inventory["retail"] = *req.InventoryRetail
	}
	if req.InventoryWholesale != nil {
		existing.Inventory["wholesale"] = *req.InventoryWholesale
	}
	if req.MOQWholesale != nil {
		if existing.MOQ == nil {
			existing.MOQ = map[string]int{}
		}
		existing.MOQ["wholesale"] = *req.MOQWholesale
	}
	if req.WeightKG != nil {
		existing.WeightKG = req.WeightKG
	}
	if req.DimensionsCM != nil {
		existing.DimensionsCM = req.DimensionsCM
	}
	if req.Status != nil {
		existing.Status = model.ProductStatus(*req.Status)
	}

	if err := h.productSvc.Update(c.Request.Context(), existing); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update product"})
		return
	}

	// Re-read to get the actual status (repo auto-sets out_of_stock when inventory=0)
	updated, err := h.productSvc.GetByID(c.Request.Context(), existing.ID)
	if err != nil {
		c.JSON(http.StatusOK, existing) // fallback to in-memory state
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *AdminHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := h.productSvc.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}

func (h *AdminHandler) UpdateInventory(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		InventoryRetail    int `json:"inventory_retail"`
		InventoryWholesale int `json:"inventory_wholesale"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if err := h.productSvc.UpdateInventory(c.Request.Context(), id, req.InventoryRetail, req.InventoryWholesale); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update inventory"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Inventory updated"})
}

// ── Orders ────────────────────────────────────────────────────────────────────

func (h *AdminHandler) ListOrders(c *gin.Context) {
	page := parseIntQuery(c, "page", 1)
	perPage := parseIntQuery(c, "per_page", 20)

	orders, total, err := h.orderRepo.ListAll(c.Request.Context(), page, perPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load orders"})
		return
	}
	if orders == nil {
		orders = []model.Order{}
	}

	totalPages := int(math.Ceil(float64(total) / float64(perPage)))
	if totalPages == 0 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"items":       orders,
		"total":       total,
		"page":        page,
		"per_page":    perPage,
		"total_pages": totalPages,
	})
}

func (h *AdminHandler) UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	if err := h.orderRepo.UpdateStatus(c.Request.Context(), id, model.OrderStatus(req.Status)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Order status updated"})
}

// ── Customers ─────────────────────────────────────────────────────────────────

func (h *AdminHandler) ListCustomers(c *gin.Context) {
	page := parseIntQuery(c, "page", 1)
	perPage := parseIntQuery(c, "per_page", 20)

	users, total, err := h.userRepo.ListAll(c.Request.Context(), page, perPage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load customers"})
		return
	}
	if users == nil {
		users = []model.User{}
	}

	totalPages := int(math.Ceil(float64(total) / float64(perPage)))
	if totalPages == 0 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"items":       users,
		"total":       total,
		"page":        page,
		"per_page":    perPage,
		"total_pages": totalPages,
	})
}

// ── B2B Wholesaler Approvals ──────────────────────────────────────────────────

func (h *AdminHandler) ListWholesalers(c *gin.Context) {
	profiles, err := h.userRepo.ListWholesalers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load wholesalers"})
		return
	}
	if profiles == nil {
		profiles = []model.WholesalerProfile{}
	}
	c.JSON(http.StatusOK, gin.H{"items": profiles})
}

func (h *AdminHandler) ApproveWholesaler(c *gin.Context) {
	userID := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required,oneof=approved rejected"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	if err := h.userRepo.UpdateWholesalerApproval(c.Request.Context(), userID, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Wholesaler " + req.Status})
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

func (h *AdminHandler) DashboardStats(c *gin.Context) {
	totalOrders, totalRevenue, totalCustomers, lowStock, err := h.orderRepo.GetStats(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load stats"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"total_revenue":   totalRevenue,
		"total_orders":    totalOrders,
		"total_customers": totalCustomers,
		"low_stock_count": lowStock,
	})
}

// ── helpers ───────────────────────────────────────────────────────────────────

func slugify(s string) string {
	s = strings.ToLower(s)
	s = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' || r == ' ' {
			return r
		}
		return -1
	}, s)
	parts := strings.Fields(s)
	return strings.Join(parts, "-")
}
