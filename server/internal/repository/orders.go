package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"devbhoomi/server/internal/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type OrderRepository struct {
	db *pgxpool.Pool
}

func NewOrderRepository(db *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) Create(ctx context.Context, o *model.Order) error {
	itemsJSON, _ := json.Marshal(o.Items)
	var addrJSON []byte
	if o.ShippingAddress != nil {
		addrJSON, _ = json.Marshal(o.ShippingAddress)
	}

	return r.db.QueryRow(ctx, `
		INSERT INTO orders (user_id, status, items, subtotal_inr, shipping_inr, total_inr,
			shipping_address, payment_method, payment_status, notes)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
		RETURNING id, created_at, updated_at`,
		o.UserID, o.Status, itemsJSON, o.SubtotalINR, o.ShippingINR, o.TotalINR,
		addrJSON, o.PaymentMethod, o.PaymentStatus, o.Notes,
	).Scan(&o.ID, &o.CreatedAt, &o.UpdatedAt)
}

func (r *OrderRepository) GetByID(ctx context.Context, id string) (*model.Order, error) {
	o := &model.Order{}
	var itemsJSON, addrJSON []byte
	var userID, paymentMethod, notes *string

	err := r.db.QueryRow(ctx, `
		SELECT id, user_id, status, items, subtotal_inr, shipping_inr, total_inr,
			shipping_address, payment_method, payment_status, notes, created_at, updated_at
		FROM orders WHERE id = $1`, id,
	).Scan(&o.ID, &userID, &o.Status, &itemsJSON, &o.SubtotalINR, &o.ShippingINR, &o.TotalINR,
		&addrJSON, &paymentMethod, &o.PaymentStatus, &notes, &o.CreatedAt, &o.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get order: %w", err)
	}

	o.UserID = userID
	if paymentMethod != nil {
		o.PaymentMethod = *paymentMethod
	}
	if notes != nil {
		o.Notes = *notes
	}
	if itemsJSON != nil {
		_ = json.Unmarshal(itemsJSON, &o.Items)
	}
	if addrJSON != nil {
		o.ShippingAddress = &model.ShippingAddress{}
		_ = json.Unmarshal(addrJSON, o.ShippingAddress)
	}
	return o, nil
}

func (r *OrderRepository) ListAll(ctx context.Context, page, perPage int) ([]model.Order, int, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	var total int
	if err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM orders`).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := r.db.Query(ctx, `
		SELECT id, user_id, status, items, subtotal_inr, shipping_inr, total_inr,
			shipping_address, payment_method, payment_status, notes, created_at, updated_at
		FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2`, perPage, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var orders []model.Order
	for rows.Next() {
		o := model.Order{}
		var itemsJSON, addrJSON []byte
		var userID, paymentMethod, notes *string

		if err := rows.Scan(&o.ID, &userID, &o.Status, &itemsJSON, &o.SubtotalINR, &o.ShippingINR, &o.TotalINR,
			&addrJSON, &paymentMethod, &o.PaymentStatus, &notes, &o.CreatedAt, &o.UpdatedAt); err != nil {
			return nil, 0, err
		}
		o.UserID = userID
		if paymentMethod != nil {
			o.PaymentMethod = *paymentMethod
		}
		if notes != nil {
			o.Notes = *notes
		}
		if itemsJSON != nil {
			_ = json.Unmarshal(itemsJSON, &o.Items)
		}
		if addrJSON != nil {
			o.ShippingAddress = &model.ShippingAddress{}
			_ = json.Unmarshal(addrJSON, o.ShippingAddress)
		}
		orders = append(orders, o)
	}
	return orders, total, nil
}

func (r *OrderRepository) ListByUser(ctx context.Context, userID string, page, perPage int) ([]model.Order, int, error) {
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	var total int
	if err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM orders WHERE user_id = $1`, userID).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := r.db.Query(ctx, `
		SELECT id, user_id, status, items, subtotal_inr, shipping_inr, total_inr,
			shipping_address, payment_method, payment_status, notes, created_at, updated_at
		FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`, userID, perPage, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var orders []model.Order
	for rows.Next() {
		o := model.Order{}
		var itemsJSON, addrJSON []byte
		var uid, paymentMethod, notes *string

		if err := rows.Scan(&o.ID, &uid, &o.Status, &itemsJSON, &o.SubtotalINR, &o.ShippingINR, &o.TotalINR,
			&addrJSON, &paymentMethod, &o.PaymentStatus, &notes, &o.CreatedAt, &o.UpdatedAt); err != nil {
			return nil, 0, err
		}
		o.UserID = uid
		if paymentMethod != nil {
			o.PaymentMethod = *paymentMethod
		}
		if notes != nil {
			o.Notes = *notes
		}
		if itemsJSON != nil {
			_ = json.Unmarshal(itemsJSON, &o.Items)
		}
		if addrJSON != nil {
			o.ShippingAddress = &model.ShippingAddress{}
			_ = json.Unmarshal(addrJSON, o.ShippingAddress)
		}
		orders = append(orders, o)
	}
	return orders, total, nil
}

func (r *OrderRepository) UpdateStatus(ctx context.Context, id string, status model.OrderStatus) error {
	tag, err := r.db.Exec(ctx, `UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2`, status, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *OrderRepository) GetStats(ctx context.Context) (totalOrders int, totalRevenue float64, totalCustomers int, lowStockCount int, err error) {
	err = r.db.QueryRow(ctx, `SELECT COALESCE(COUNT(*),0), COALESCE(SUM(total_inr),0) FROM orders WHERE payment_status='paid'`).
		Scan(&totalOrders, &totalRevenue)
	if err != nil {
		return
	}
	err = r.db.QueryRow(ctx, `SELECT COUNT(DISTINCT id) FROM users WHERE role='customer'`).Scan(&totalCustomers)
	if err != nil {
		return
	}
	err = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM products WHERE inventory_retail <= 10 AND status='active'`).Scan(&lowStockCount)
	return
}
