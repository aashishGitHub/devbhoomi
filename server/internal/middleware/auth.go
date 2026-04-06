package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const (
	CtxUserID    = "user_id"
	CtxUserEmail = "user_email"
	CtxUserName  = "user_name"
	CtxUserRole  = "user_role"
)

// RequireAuth rejects requests without a valid JWT.
func RequireAuth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := extractClaims(c, jwtSecret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Authentication required"})
			return
		}
		setClaims(c, claims)
		c.Next()
	}
}

// OptionalAuth parses the JWT if present but does not block the request.
func OptionalAuth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if claims, err := extractClaims(c, jwtSecret); err == nil {
			setClaims(c, claims)
		}
		c.Next()
	}
}

// RequireRole requires the caller to have the specified role.
func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if r, _ := c.Get(CtxUserRole); r != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Insufficient permissions"})
			return
		}
		c.Next()
	}
}

// RequireRoles allows any of the given roles through.
func RequireRoles(roles ...string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(roles))
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(c *gin.Context) {
		role, _ := c.Get(CtxUserRole)
		if _, ok := allowed[fmt.Sprintf("%v", role)]; !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Insufficient permissions"})
			return
		}
		c.Next()
	}
}

func extractClaims(c *gin.Context, secret string) (jwt.MapClaims, error) {
	tokenStr := ""

	if auth := c.GetHeader("Authorization"); strings.HasPrefix(auth, "Bearer ") {
		tokenStr = auth[7:]
	}

	if tokenStr == "" {
		return nil, fmt.Errorf("no token")
	}

	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid claims")
	}
	return claims, nil
}

func setClaims(c *gin.Context, claims jwt.MapClaims) {
	if v, ok := claims["user_id"]; ok {
		c.Set(CtxUserID, fmt.Sprintf("%v", v))
	}
	if v, ok := claims["email"]; ok {
		c.Set(CtxUserEmail, fmt.Sprintf("%v", v))
	}
	if v, ok := claims["name"]; ok {
		c.Set(CtxUserName, fmt.Sprintf("%v", v))
	}
	if v, ok := claims["role"]; ok {
		c.Set(CtxUserRole, fmt.Sprintf("%v", v))
	}
}
