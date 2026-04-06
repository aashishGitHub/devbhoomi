package handler

import (
	"errors"
	"net/http"

	"devbhoomi/server/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	svc *service.AuthService
}

func NewAuthHandler(svc *service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req struct {
		Name        string `json:"name"         binding:"required,min=2"`
		Email       string `json:"email"        binding:"required,email"`
		Password    string `json:"password"     binding:"required,min=8"`
		Phone       string `json:"phone"`
		AccountType string `json:"account_type" binding:"required,oneof=customer wholesaler"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	resp, err := h.svc.Register(c.Request.Context(), service.RegisterInput{
		Name:        req.Name,
		Email:       req.Email,
		Password:    req.Password,
		Phone:       req.Phone,
		AccountType: req.AccountType,
	})
	if err != nil {
		switch {
		case errors.Is(err, service.ErrEmailTaken):
			c.JSON(http.StatusConflict, gin.H{"message": "Email already registered"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Registration failed"})
		}
		return
	}

	c.JSON(http.StatusCreated, resp)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"    binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	resp, err := h.svc.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Login failed"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) AdminLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email"    binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	resp, err := h.svc.AdminLogin(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInvalidCredentials):
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		case errors.Is(err, service.ErrAdminOnly):
			c.JSON(http.StatusForbidden, gin.H{"message": "Admin access required"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Login failed"})
		}
		return
	}

	// Return as { token } for admin panel compatibility
	c.JSON(http.StatusOK, gin.H{"token": resp.AccessToken, "refresh_token": resp.RefreshToken, "expires_in": resp.ExpiresIn})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	resp, err := h.svc.Refresh(c.Request.Context(), req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid or expired refresh token"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	_ = c.ShouldBindJSON(&req)
	if req.RefreshToken != "" {
		_ = h.svc.Logout(c.Request.Context(), req.RefreshToken)
	}
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}
