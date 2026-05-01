package model

import "time"

type OrderStatus string

const (
	OrderPending    OrderStatus = "pending"
	OrderConfirmed  OrderStatus = "confirmed"
	OrderProcessing OrderStatus = "processing"
	OrderShipped    OrderStatus = "shipped"
	OrderDelivered  OrderStatus = "delivered"
	OrderCancelled  OrderStatus = "cancelled"
	OrderRefunded   OrderStatus = "refunded"
)

type OrderItem struct {
	ProductID   string  `json:"product_id"`
	VariantName string  `json:"variant_name,omitempty"`
	Name        string  `json:"name"`
	Slug        string  `json:"slug"`
	Image       string  `json:"image"`
	PriceINR    float64 `json:"price_inr"`
	Quantity    int     `json:"quantity"`
}

type ShippingAddress struct {
	Name    string `json:"name"`
	Line1   string `json:"line1"`
	Line2   string `json:"line2,omitempty"`
	City    string `json:"city"`
	State   string `json:"state"`
	Pincode string `json:"pincode"`
	Phone   string `json:"phone"`
}

type Order struct {
	ID              string          `json:"id"`
	UserID          *string         `json:"user_id,omitempty"`
	Status          OrderStatus     `json:"status"`
	Items           []OrderItem     `json:"items"`
	SubtotalINR     float64         `json:"subtotal_inr"`
	ShippingINR     float64         `json:"shipping_inr"`
	TotalINR        float64         `json:"total_inr"`
	ShippingAddress *ShippingAddress `json:"shipping_address,omitempty"`
	PaymentMethod   string          `json:"payment_method,omitempty"`
	PaymentStatus   string          `json:"payment_status"`
	Notes           string          `json:"notes,omitempty"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

type OrderListResponse struct {
	Items      []Order `json:"items"`
	Total      int     `json:"total"`
	Page       int     `json:"page"`
	PerPage    int     `json:"per_page"`
	TotalPages int     `json:"total_pages"`
}
