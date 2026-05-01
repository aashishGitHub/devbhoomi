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

type CartRepository struct {
	db *pgxpool.Pool
}

func NewCartRepository(db *pgxpool.Pool) *CartRepository {
	return &CartRepository{db: db}
}

func (r *CartRepository) GetByUserID(ctx context.Context, userID string) (*model.Cart, error) {
	cart := &model.Cart{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, session_id, created_at, updated_at
		 FROM carts WHERE user_id = $1 AND expires_at > NOW()
		 ORDER BY created_at DESC LIMIT 1`,
		userID,
	).Scan(&cart.ID, &cart.UserID, &cart.SessionID, &cart.CreatedAt, &cart.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get cart by user: %w", err)
	}
	return r.loadItems(ctx, cart)
}

func (r *CartRepository) GetBySessionID(ctx context.Context, sessionID string) (*model.Cart, error) {
	cart := &model.Cart{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, session_id, created_at, updated_at
		 FROM carts WHERE session_id = $1 AND user_id IS NULL AND expires_at > NOW()
		 ORDER BY created_at DESC LIMIT 1`,
		sessionID,
	).Scan(&cart.ID, &cart.UserID, &cart.SessionID, &cart.CreatedAt, &cart.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("get cart by session: %w", err)
	}
	return r.loadItems(ctx, cart)
}

func (r *CartRepository) Create(ctx context.Context, userID, sessionID string) (*model.Cart, error) {
	cart := &model.Cart{}
	var uid, sid *string
	if userID != "" {
		uid = &userID
	}
	if sessionID != "" {
		sid = &sessionID
	}
	err := r.db.QueryRow(ctx,
		`INSERT INTO carts (user_id, session_id)
		 VALUES ($1, $2)
		 RETURNING id, user_id, session_id, created_at, updated_at`,
		uid, sid,
	).Scan(&cart.ID, &cart.UserID, &cart.SessionID, &cart.CreatedAt, &cart.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("create cart: %w", err)
	}
	cart.Items = []model.CartItem{}
	return cart, nil
}

func (r *CartRepository) UpsertItem(ctx context.Context, cartID string, item *model.CartItem) (*model.CartItem, error) {
	result := &model.CartItem{}
	err := r.db.QueryRow(ctx,
		`INSERT INTO cart_items (cart_id, product_id, name, slug, image, price_inr, quantity)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 ON CONFLICT (cart_id, product_id)
		 DO UPDATE SET
		   quantity  = cart_items.quantity + EXCLUDED.quantity,
		   price_inr = EXCLUDED.price_inr
		 RETURNING id, cart_id, product_id, name, slug, image, price_inr, quantity`,
		cartID, item.ProductID, item.Name, item.Slug, item.Image, item.PriceINR, item.Quantity,
	).Scan(&result.ID, &result.CartID, &result.ProductID, &result.Name,
		&result.Slug, &result.Image, &result.PriceINR, &result.Quantity)
	if err != nil {
		return nil, fmt.Errorf("upsert cart item: %w", err)
	}

	_, _ = r.db.Exec(ctx, `UPDATE carts SET updated_at = $1 WHERE id = $2`, time.Now(), cartID)
	return result, nil
}

func (r *CartRepository) UpdateItemQuantity(ctx context.Context, cartID, itemID string, quantity int) (*model.CartItem, error) {
	result := &model.CartItem{}
	err := r.db.QueryRow(ctx,
		`UPDATE cart_items SET quantity = $1
		 WHERE id = $2 AND cart_id = $3
		 RETURNING id, cart_id, product_id, name, slug, image, price_inr, quantity`,
		quantity, itemID, cartID,
	).Scan(&result.ID, &result.CartID, &result.ProductID, &result.Name,
		&result.Slug, &result.Image, &result.PriceINR, &result.Quantity)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("update cart item: %w", err)
	}
	return result, nil
}

func (r *CartRepository) RemoveItem(ctx context.Context, cartID, itemID string) error {
	tag, err := r.db.Exec(ctx,
		`DELETE FROM cart_items WHERE id = $1 AND cart_id = $2`, itemID, cartID)
	if err != nil {
		return fmt.Errorf("remove cart item: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *CartRepository) MergeGuestCart(ctx context.Context, sessionID, userID string) error {
	// Find guest cart
	var guestCartID string
	err := r.db.QueryRow(ctx,
		`SELECT id FROM carts WHERE session_id = $1 AND user_id IS NULL AND expires_at > NOW()
		 ORDER BY created_at DESC LIMIT 1`,
		sessionID,
	).Scan(&guestCartID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil // nothing to merge
		}
		return err
	}

	// Find or create user cart
	var userCartID string
	err = r.db.QueryRow(ctx,
		`SELECT id FROM carts WHERE user_id = $1 AND expires_at > NOW()
		 ORDER BY created_at DESC LIMIT 1`,
		userID,
	).Scan(&userCartID)
	if errors.Is(err, pgx.ErrNoRows) {
		// create user cart
		err = r.db.QueryRow(ctx,
			`INSERT INTO carts (user_id) VALUES ($1) RETURNING id`, userID,
		).Scan(&userCartID)
	}
	if err != nil {
		return err
	}

	// Move items from guest cart to user cart (upsert)
	_, err = r.db.Exec(ctx, `
		INSERT INTO cart_items (cart_id, product_id, name, slug, image, price_inr, quantity)
		SELECT $1, product_id, name, slug, image, price_inr, quantity
		FROM cart_items WHERE cart_id = $2
		ON CONFLICT (cart_id, product_id)
		DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
		userCartID, guestCartID,
	)
	if err != nil {
		return fmt.Errorf("merge cart items: %w", err)
	}

	// Delete the guest cart
	_, _ = r.db.Exec(ctx, `DELETE FROM carts WHERE id = $1`, guestCartID)
	return nil
}

func (r *CartRepository) ClearCart(ctx context.Context, cartID string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM cart_items WHERE cart_id = $1`, cartID)
	return err
}

func (r *CartRepository) loadItems(ctx context.Context, cart *model.Cart) (*model.Cart, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, cart_id, product_id, name, slug, image, price_inr, quantity
		 FROM cart_items WHERE cart_id = $1 ORDER BY created_at`,
		cart.ID,
	)
	if err != nil {
		return nil, fmt.Errorf("load cart items: %w", err)
	}
	defer rows.Close()

	cart.Items = []model.CartItem{}
	for rows.Next() {
		var item model.CartItem
		if err := rows.Scan(&item.ID, &item.CartID, &item.ProductID, &item.Name,
			&item.Slug, &item.Image, &item.PriceINR, &item.Quantity); err != nil {
			return nil, err
		}
		cart.Items = append(cart.Items, item)
	}
	return cart, nil
}
