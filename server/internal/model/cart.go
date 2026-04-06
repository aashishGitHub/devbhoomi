package model

import "time"

type Cart struct {
	ID        string     `json:"id"`
	UserID    *string    `json:"-"`
	SessionID *string    `json:"-"`
	Items     []CartItem `json:"items"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

type CartItem struct {
	ID        string  `json:"id"`
	CartID    string  `json:"-"`
	ProductID string  `json:"product_id"`
	Name      string  `json:"name"`
	Slug      string  `json:"slug"`
	Image     string  `json:"image"`
	PriceINR  float64 `json:"price_inr"`
	Quantity  int     `json:"quantity"`
}

type CartResponse struct {
	Items       []CartItem `json:"items"`
	SubtotalINR float64    `json:"subtotal_inr"`
	ItemCount   int        `json:"item_count"`
}

func NewCartResponse(cart *Cart) CartResponse {
	var subtotal float64
	var count int
	for _, item := range cart.Items {
		subtotal += item.PriceINR * float64(item.Quantity)
		count += item.Quantity
	}
	return CartResponse{
		Items:       cart.Items,
		SubtotalINR: subtotal,
		ItemCount:   count,
	}
}
