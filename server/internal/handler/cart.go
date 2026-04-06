package handler

import (
	"net/http"

	"devbhoomi/server/internal/middleware"
	"devbhoomi/server/internal/service"

	"github.com/gin-gonic/gin"
)

type CartHandler struct {
	svc *service.CartService
}

func NewCartHandler(svc *service.CartService) *CartHandler {
	return &CartHandler{svc: svc}
}

func (h *CartHandler) Get(c *gin.Context) {
	userID, sessionID := resolveIdentity(c)
	resp, err := h.svc.Get(c.Request.Context(), userID, sessionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load cart"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *CartHandler) AddItem(c *gin.Context) {
	var req struct {
		ProductID string `json:"product_id" binding:"required"`
		Quantity  int    `json:"quantity"   binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	userID, sessionID := resolveIdentity(c)
	isWholesaler := resolveRole(c) == "wholesaler"

	resp, err := h.svc.AddItem(c.Request.Context(), userID, sessionID, req.ProductID, req.Quantity, isWholesaler)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *CartHandler) UpdateItem(c *gin.Context) {
	itemID := c.Param("id")
	var req struct {
		Quantity int `json:"quantity" binding:"min=0"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	userID, sessionID := resolveIdentity(c)
	resp, err := h.svc.UpdateItem(c.Request.Context(), userID, sessionID, itemID, req.Quantity)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *CartHandler) RemoveItem(c *gin.Context) {
	itemID := c.Param("id")
	userID, sessionID := resolveIdentity(c)
	resp, err := h.svc.RemoveItem(c.Request.Context(), userID, sessionID, itemID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// ── helpers ───────────────────────────────────────────────────────────────────

func resolveIdentity(c *gin.Context) (userID, sessionID string) {
	if uid, exists := c.Get(middleware.CtxUserID); exists {
		return uid.(string), ""
	}
	return "", c.GetHeader("X-Cart-Session")
}

func resolveRole(c *gin.Context) string {
	if r, exists := c.Get(middleware.CtxUserRole); exists {
		return r.(string)
	}
	return ""
}
