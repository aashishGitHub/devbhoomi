package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"devbhoomi/server/internal/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNotFound = errors.New("not found")
var ErrDuplicateEmail = errors.New("email already registered")

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, u *model.User) error {
	err := r.db.QueryRow(ctx,
		`INSERT INTO users (name, email, password_hash, role, phone)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, created_at, updated_at`,
		u.Name, u.Email, u.PasswordHash, u.Role, nullStr(u.Phone),
	).Scan(&u.ID, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if isDuplicateKey(err) {
			return ErrDuplicateEmail
		}
		return fmt.Errorf("create user: %w", err)
	}
	return nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	u := &model.User{}
	var phone *string
	err := r.db.QueryRow(ctx,
		`SELECT id, name, email, password_hash, role, phone, created_at, updated_at
		 FROM users WHERE email = $1`,
		email,
	).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &phone, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get user by email: %w", err)
	}
	if phone != nil {
		u.Phone = *phone
	}
	return u, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (*model.User, error) {
	u := &model.User{}
	var phone *string
	err := r.db.QueryRow(ctx,
		`SELECT id, name, email, password_hash, role, phone, created_at, updated_at
		 FROM users WHERE id = $1`,
		id,
	).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &phone, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get user by id: %w", err)
	}
	if phone != nil {
		u.Phone = *phone
	}
	return u, nil
}

func (r *UserRepository) ListAll(ctx context.Context, page, perPage int) ([]model.User, int, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	var total int
	if err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM users`).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := r.db.Query(ctx,
		`SELECT id, name, email, role, phone, created_at, updated_at
		 FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`, perPage, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var users []model.User
	for rows.Next() {
		u := model.User{}
		var phone *string
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Role, &phone, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, 0, err
		}
		if phone != nil {
			u.Phone = *phone
		}
		users = append(users, u)
	}
	return users, total, nil
}

func (r *UserRepository) UpdateWholesalerApproval(ctx context.Context, userID, status string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE wholesaler_profiles SET approval_status=$1 WHERE user_id=$2`, status, userID)
	return err
}

func (r *UserRepository) ListWholesalers(ctx context.Context) ([]model.WholesalerProfile, error) {
	rows, err := r.db.Query(ctx,
		`SELECT wp.user_id, wp.company_name, wp.gstin, wp.tier, wp.credit_limit_inr,
		        wp.credit_used_inr, wp.credit_terms, wp.tax_exempt, wp.approval_status, wp.created_at
		 FROM wholesaler_profiles wp ORDER BY wp.created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var profiles []model.WholesalerProfile
	for rows.Next() {
		p := model.WholesalerProfile{}
		var companyName, gstin, creditTerms *string
		if err := rows.Scan(&p.UserID, &companyName, &gstin, &p.Tier, &p.CreditLimitINR,
			&p.CreditUsedINR, &creditTerms, &p.TaxExempt, &p.ApprovalStatus, &p.CreatedAt); err != nil {
			return nil, err
		}
		if companyName != nil {
			p.CompanyName = *companyName
		}
		if gstin != nil {
			p.GSTIN = *gstin
		}
		if creditTerms != nil {
			p.CreditTerms = *creditTerms
		}
		profiles = append(profiles, p)
	}
	return profiles, nil
}

func (r *UserRepository) CreateWholesalerProfile(ctx context.Context, p *model.WholesalerProfile) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO wholesaler_profiles (user_id, company_name, gstin, tier, approval_status)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (user_id) DO NOTHING`,
		p.UserID, nullStr(p.CompanyName), nullStr(p.GSTIN), p.Tier, p.ApprovalStatus,
	)
	if err != nil {
		return fmt.Errorf("create wholesaler profile: %w", err)
	}
	return nil
}

func (r *UserRepository) GetWholesalerProfile(ctx context.Context, userID string) (*model.WholesalerProfile, error) {
	p := &model.WholesalerProfile{}
	var companyName, gstin, creditTerms *string
	err := r.db.QueryRow(ctx,
		`SELECT user_id, company_name, gstin, tier, credit_limit_inr, credit_used_inr,
		        credit_terms, tax_exempt, approval_status, created_at
		 FROM wholesaler_profiles WHERE user_id = $1`,
		userID,
	).Scan(&p.UserID, &companyName, &gstin, &p.Tier, &p.CreditLimitINR, &p.CreditUsedINR,
		&creditTerms, &p.TaxExempt, &p.ApprovalStatus, &p.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get wholesaler profile: %w", err)
	}
	if companyName != nil {
		p.CompanyName = *companyName
	}
	if gstin != nil {
		p.GSTIN = *gstin
	}
	if creditTerms != nil {
		p.CreditTerms = *creditTerms
	}
	return p, nil
}

// ── Refresh Tokens ────────────────────────────────────────────────────────────

func (r *UserRepository) CreateRefreshToken(ctx context.Context, t *model.RefreshToken) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		 VALUES ($1, $2, $3)`,
		t.UserID, t.TokenHash, t.ExpiresAt,
	)
	return err
}

func (r *UserRepository) GetRefreshToken(ctx context.Context, tokenHash string) (*model.RefreshToken, error) {
	t := &model.RefreshToken{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, token_hash, expires_at, created_at
		 FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()`,
		tokenHash,
	).Scan(&t.ID, &t.UserID, &t.TokenHash, &t.ExpiresAt, &t.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get refresh token: %w", err)
	}
	return t, nil
}

func (r *UserRepository) DeleteRefreshToken(ctx context.Context, tokenHash string) error {
	_, err := r.db.Exec(ctx,
		`DELETE FROM refresh_tokens WHERE token_hash = $1`, tokenHash)
	return err
}

func (r *UserRepository) DeleteAllRefreshTokens(ctx context.Context, userID string) error {
	_, err := r.db.Exec(ctx,
		`DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at > $2`,
		userID, time.Now())
	return err
}

// ── helpers ───────────────────────────────────────────────────────────────────

func nullStr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func isDuplicateKey(err error) bool {
	return err != nil && (contains(err.Error(), "duplicate key") || contains(err.Error(), "unique constraint"))
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsStr(s, substr))
}

func containsStr(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
