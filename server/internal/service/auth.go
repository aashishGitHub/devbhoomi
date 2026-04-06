package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrEmailTaken         = errors.New("email already registered")
	ErrAdminOnly          = errors.New("admin access required")
)

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
}

type RegisterInput struct {
	Name        string
	Email       string
	Password    string
	Phone       string
	AccountType string
}

type AuthService struct {
	users          *repository.UserRepository
	jwtSecret      []byte
	accessTokenTTL time.Duration
	refreshTokenTTL time.Duration
}

func NewAuthService(
	users *repository.UserRepository,
	jwtSecret string,
	accessTTL, refreshTTL time.Duration,
) *AuthService {
	return &AuthService{
		users:           users,
		jwtSecret:       []byte(jwtSecret),
		accessTokenTTL:  accessTTL,
		refreshTokenTTL: refreshTTL,
	}
}

func (s *AuthService) Register(ctx context.Context, input RegisterInput) (*AuthResponse, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	role := model.RoleCustomer
	if input.AccountType == "wholesaler" {
		role = model.RoleWholesaler
	}

	u := &model.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hash),
		Role:         role,
		Phone:        input.Phone,
	}

	if err := s.users.Create(ctx, u); err != nil {
		if errors.Is(err, repository.ErrDuplicateEmail) {
			return nil, ErrEmailTaken
		}
		return nil, err
	}

	if role == model.RoleWholesaler {
		_ = s.users.CreateWholesalerProfile(ctx, &model.WholesalerProfile{
			UserID:         u.ID,
			Tier:           "starter",
			ApprovalStatus: "pending",
		})
	}

	return s.issueTokens(ctx, u)
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*AuthResponse, error) {
	u, err := s.users.GetByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return s.issueTokens(ctx, u)
}

func (s *AuthService) AdminLogin(ctx context.Context, email, password string) (*AuthResponse, error) {
	resp, err := s.Login(ctx, email, password)
	if err != nil {
		return nil, err
	}

	// Decode the just-issued token to verify admin role
	claims, err := s.parseToken(resp.AccessToken)
	if err != nil {
		return nil, ErrAdminOnly
	}
	if role, _ := claims["role"].(string); role != string(model.RoleAdmin) {
		return nil, ErrAdminOnly
	}
	return resp, nil
}

func (s *AuthService) Refresh(ctx context.Context, rawToken string) (*AuthResponse, error) {
	hash := hashToken(rawToken)

	stored, err := s.users.GetRefreshToken(ctx, hash)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if err := s.users.DeleteRefreshToken(ctx, hash); err != nil {
		return nil, err
	}

	u, err := s.users.GetByID(ctx, stored.UserID)
	if err != nil {
		return nil, err
	}

	return s.issueTokens(ctx, u)
}

func (s *AuthService) Logout(ctx context.Context, rawToken string) error {
	hash := hashToken(rawToken)
	return s.users.DeleteRefreshToken(ctx, hash)
}

// ── internal ──────────────────────────────────────────────────────────────────

func (s *AuthService) issueTokens(ctx context.Context, u *model.User) (*AuthResponse, error) {
	accessToken, err := s.generateAccessToken(u)
	if err != nil {
		return nil, fmt.Errorf("generate access token: %w", err)
	}

	rawRefresh, err := generateRandomToken()
	if err != nil {
		return nil, fmt.Errorf("generate refresh token: %w", err)
	}

	rt := &model.RefreshToken{
		UserID:    u.ID,
		TokenHash: hashToken(rawRefresh),
		ExpiresAt: time.Now().Add(s.refreshTokenTTL),
	}
	if err := s.users.CreateRefreshToken(ctx, rt); err != nil {
		return nil, fmt.Errorf("store refresh token: %w", err)
	}

	return &AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: rawRefresh,
		ExpiresIn:    int(s.accessTokenTTL.Seconds()),
	}, nil
}

func (s *AuthService) generateAccessToken(u *model.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": u.ID,
		"email":   u.Email,
		"name":    u.Name,
		"role":    string(u.Role),
		"iat":     time.Now().Unix(),
		"exp":     time.Now().Add(s.accessTokenTTL).Unix(),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(s.jwtSecret)
}

func (s *AuthService) parseToken(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return s.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, ErrInvalidCredentials
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, ErrInvalidCredentials
	}
	return claims, nil
}

func generateRandomToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func hashToken(raw string) string {
	h := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(h[:])
}
