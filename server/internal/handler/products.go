package handler

import (
	"errors"
	"net/http"
	"strconv"

	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/repository"
	"devbhoomi/server/internal/service"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	svc *service.ProductService
}

func NewProductHandler(svc *service.ProductService) *ProductHandler {
	return &ProductHandler{svc: svc}
}

func (h *ProductHandler) List(c *gin.Context) {
	params := model.ProductSearchParams{
		Q:        c.Query("q"),
		Category: c.Query("category"),
		Sort:     c.Query("sort"),
		Page:     parseIntQuery(c, "page", 1),
		PerPage:  parseIntQuery(c, "per_page", 20),
	}

	if min := c.Query("min_price"); min != "" {
		if v, err := strconv.ParseFloat(min, 64); err == nil {
			params.MinPrice = &v
		}
	}
	if max := c.Query("max_price"); max != "" {
		if v, err := strconv.ParseFloat(max, 64); err == nil {
			params.MaxPrice = &v
		}
	}

	resp, err := h.svc.List(c.Request.Context(), params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load products"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *ProductHandler) Get(c *gin.Context) {
	slug := c.Param("slug")
	product, err := h.svc.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load product"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) Search(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "q parameter is required"})
		return
	}
	resp, err := h.svc.Search(c.Request.Context(), q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Search failed"})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func parseIntQuery(c *gin.Context, key string, fallback int) int {
	if v := c.Query(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			return n
		}
	}
	return fallback
}
