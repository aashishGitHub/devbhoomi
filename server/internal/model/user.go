package model

import "time"

type Role string

const (
	RoleCustomer   Role = "customer"
	RoleWholesaler Role = "wholesaler"
	RoleAdmin      Role = "admin"
)

type User struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Email         string    `json:"email"`
	PasswordHash  string    `json:"-"`
	Role          Role      `json:"role"`
	Phone         string    `json:"phone,omitempty"`
	AddressLine1  string    `json:"address_line1,omitempty"`
	AddressLine2  string    `json:"address_line2,omitempty"`
	AddressCity   string    `json:"address_city,omitempty"`
	AddressState  string    `json:"address_state,omitempty"`
	AddressPincode string  `json:"address_pincode,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type WholesalerProfile struct {
	UserID         string    `json:"user_id"`
	CompanyName    string    `json:"company_name,omitempty"`
	GSTIN          string    `json:"gstin,omitempty"`
	Tier           string    `json:"tier"`
	CreditLimitINR float64   `json:"credit_limit_inr"`
	CreditUsedINR  float64   `json:"credit_used_inr"`
	CreditTerms    string    `json:"credit_terms,omitempty"`
	TaxExempt      bool      `json:"tax_exempt"`
	ApprovalStatus string    `json:"approval_status"`
	CreatedAt      time.Time `json:"created_at"`
}

type RefreshToken struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	TokenHash string    `db:"token_hash"`
	ExpiresAt time.Time `db:"expires_at"`
	CreatedAt time.Time `db:"created_at"`
}
