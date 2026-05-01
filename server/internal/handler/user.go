package handler

import (
	"math"
	"net/http"

	"devbhoomi/server/internal/middleware"
	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/repository"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	orderRepo *repository.OrderRepository
	userRepo  *repository.UserRepository
	cartRepo  *repository.CartRepository
}

func NewUserHandler(orderRepo *repository.OrderRepository, userRepo *repository.UserRepository, cartRepo *repository.CartRepository) *UserHandler {
	return &UserHandler{orderRepo: orderRepo, userRepo: userRepo, cartRepo: cartRepo}
}

// GetProfile returns the authenticated user's profile.
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, _ := c.Get(middleware.CtxUserID)
	uid := userID.(string)

	u, err := h.userRepo.GetByID(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":              u.ID,
		"name":            u.Name,
		"email":           u.Email,
		"role":            u.Role,
		"phone":           u.Phone,
		"address_line1":   u.AddressLine1,
		"address_line2":   u.AddressLine2,
		"address_city":    u.AddressCity,
		"address_state":   u.AddressState,
		"address_pincode": u.AddressPincode,
		"created_at":      u.CreatedAt,
	})
}

// UpdateProfile allows the authenticated user to update their name, phone, and address.
// Uses pointer fields so omitted JSON keys are not overwritten with zero values.
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, _ := c.Get(middleware.CtxUserID)
	uid := userID.(string)

	var req struct {
		Name           *string `json:"name"           binding:"omitempty,min=2"`
		Phone          *string `json:"phone"`
		AddressLine1   *string `json:"address_line1"`
		AddressLine2   *string `json:"address_line2"`
		AddressCity    *string `json:"address_city"`
		AddressState   *string `json:"address_state"`
		AddressPincode *string `json:"address_pincode"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// Fetch current profile
	u, err := h.userRepo.GetByID(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	// Apply partial updates — only overwrite fields that were present in the JSON.
	// Sending a key with an empty string clears the field.
	if req.Name != nil {
		u.Name = *req.Name
	}
	if req.Phone != nil {
		u.Phone = *req.Phone
	}
	if req.AddressLine1 != nil {
		u.AddressLine1 = *req.AddressLine1
	}
	if req.AddressLine2 != nil {
		u.AddressLine2 = *req.AddressLine2
	}
	if req.AddressCity != nil {
		u.AddressCity = *req.AddressCity
	}
	if req.AddressState != nil {
		u.AddressState = *req.AddressState
	}
	if req.AddressPincode != nil {
		u.AddressPincode = *req.AddressPincode
	}

	if err := h.userRepo.UpdateProfile(c.Request.Context(), u); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":              u.ID,
		"name":            u.Name,
		"email":           u.Email,
		"role":            u.Role,
		"phone":           u.Phone,
		"address_line1":   u.AddressLine1,
		"address_line2":   u.AddressLine2,
		"address_city":    u.AddressCity,
		"address_state":   u.AddressState,
		"address_pincode": u.AddressPincode,
		"created_at":      u.CreatedAt,
	})
}

// GetMyOrders returns paginated order history for the authenticated user.
func (h *UserHandler) GetMyOrders(c *gin.Context) {
	userID, _ := c.Get(middleware.CtxUserID)
	uid := userID.(string)

	page := parseIntQuery(c, "page", 1)
	perPage := parseIntQuery(c, "per_page", 10)

	orders, total, err := h.orderRepo.ListByUser(c.Request.Context(), uid, page, perPage)
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

	c.JSON(http.StatusOK, model.OrderListResponse{
		Items:      orders,
		Total:      total,
		Page:       page,
		PerPage:    perPage,
		TotalPages: totalPages,
	})
}

// PlaceOrder creates an order. Works for both authenticated and guest users.
// Authenticated users: items are taken from the server-side cart.
// Guest users: items must be provided in the request body.
func (h *UserHandler) PlaceOrder(c *gin.Context) {
	var req struct {
		ShippingAddress *model.ShippingAddress `json:"shipping_address" binding:"required"`
		PaymentMethod   string                 `json:"payment_method"`
		Notes           string                 `json:"notes"`
		Items           []model.OrderItem      `json:"items"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// Determine user ID (nil for guest)
	var uid *string
	if userID, exists := c.Get(middleware.CtxUserID); exists {
		s := userID.(string)
		uid = &s
	}

	var orderItems []model.OrderItem
	var subtotal float64

	// If authenticated and no items in request, load from cart
	if uid != nil && len(req.Items) == 0 {
		cart, err := h.cartRepo.GetByUserID(c.Request.Context(), *uid)
		if err != nil || len(cart.Items) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Cart is empty"})
			return
		}
		for _, ci := range cart.Items {
			orderItems = append(orderItems, model.OrderItem{
				ProductID: ci.ProductID,
				Name:      ci.Name,
				Slug:      ci.Slug,
				Image:     ci.Image,
				PriceINR:  ci.PriceINR,
				Quantity:  ci.Quantity,
			})
			subtotal += ci.PriceINR * float64(ci.Quantity)
		}
	} else if len(req.Items) > 0 {
		// Items provided in request (guest or explicit)
		orderItems = req.Items
		for _, item := range req.Items {
			subtotal += item.PriceINR * float64(item.Quantity)
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No items to order"})
		return
	}

	shipping := 0.0
	if subtotal < 500 {
		shipping = 49.0
	}

	order := &model.Order{
		UserID:          uid,
		Status:          model.OrderPending,
		Items:           orderItems,
		SubtotalINR:     subtotal,
		ShippingINR:     shipping,
		TotalINR:        subtotal + shipping,
		ShippingAddress: req.ShippingAddress,
		PaymentMethod:   req.PaymentMethod,
		PaymentStatus:   "pending",
		Notes:           req.Notes,
	}

	if err := h.orderRepo.Create(c.Request.Context(), order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to place order"})
		return
	}

	// Clear the user's cart after successful order (if authenticated)
	if uid != nil {
		cart, err := h.cartRepo.GetByUserID(c.Request.Context(), *uid)
		if err == nil {
			_ = h.cartRepo.ClearCart(c.Request.Context(), cart.ID)
		}
	}

	c.JSON(http.StatusCreated, order)
}
