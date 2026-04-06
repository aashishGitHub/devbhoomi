package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"devbhoomi/server/internal/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProductRepository struct {
	db *pgxpool.Pool
}

func NewProductRepository(db *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{db: db}
}

const productColumns = `
	id, name, slug, category, subcategory, description,
	price_inr, price_usd, b2b_pricing, traceability, scientific_attributes,
	images, seo, inventory_retail, inventory_wholesale, moq_wholesale,
	weight_kg, dimensions_cm, status, created_at, updated_at`

func (r *ProductRepository) List(ctx context.Context, params model.ProductSearchParams) ([]model.Product, int, error) {
	args := []interface{}{}
	conditions := []string{"status = 'active'"}
	i := 1

	if params.Category != "" {
		args = append(args, params.Category)
		conditions = append(conditions, fmt.Sprintf("category = $%d", i))
		i++
	}
	if params.MinPrice != nil {
		args = append(args, *params.MinPrice)
		conditions = append(conditions, fmt.Sprintf("price_inr >= $%d", i))
		i++
	}
	if params.MaxPrice != nil {
		args = append(args, *params.MaxPrice)
		conditions = append(conditions, fmt.Sprintf("price_inr <= $%d", i))
		i++
	}
	if params.Q != "" {
		args = append(args, "%"+params.Q+"%")
		conditions = append(conditions, fmt.Sprintf("(name ILIKE $%d OR description ILIKE $%d)", i, i))
		i++
	}

	where := strings.Join(conditions, " AND ")

	orderBy := "created_at DESC"
	switch params.Sort {
	case "price_asc":
		orderBy = "price_inr ASC"
	case "price_desc":
		orderBy = "price_inr DESC"
	case "name_asc":
		orderBy = "name ASC"
	}

	if params.Page < 1 {
		params.Page = 1
	}
	if params.PerPage < 1 {
		params.PerPage = 20
	}
	offset := (params.Page - 1) * params.PerPage

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM products WHERE %s", where)
	var total int
	if err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("count products: %w", err)
	}

	args = append(args, params.PerPage, offset)
	query := fmt.Sprintf(`
		SELECT %s FROM products WHERE %s
		ORDER BY %s LIMIT $%d OFFSET $%d`,
		productColumns, where, orderBy, i, i+1)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("list products: %w", err)
	}
	defer rows.Close()

	var products []model.Product
	for rows.Next() {
		p, err := scanProductRow(rows)
		if err != nil {
			return nil, 0, err
		}
		products = append(products, *p)
	}
	return products, total, nil
}

func (r *ProductRepository) GetBySlug(ctx context.Context, slug string) (*model.Product, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+productColumns+` FROM products WHERE slug = $1 AND status != 'inactive'`,
		slug)
	if err != nil {
		return nil, fmt.Errorf("get product: %w", err)
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, ErrNotFound
	}
	p, err := scanProductRow(rows)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *ProductRepository) GetByID(ctx context.Context, id string) (*model.Product, error) {
	rows, err := r.db.Query(ctx,
		`SELECT `+productColumns+` FROM products WHERE id = $1`, id)
	if err != nil {
		return nil, fmt.Errorf("get product by id: %w", err)
	}
	defer rows.Close()

	if !rows.Next() {
		if errors.Is(rows.Err(), pgx.ErrNoRows) || rows.Err() == nil {
			return nil, ErrNotFound
		}
		return nil, rows.Err()
	}
	return scanProductRow(rows)
}

func scanProductRow(rows pgx.Rows) (*model.Product, error) {
	p := &model.Product{
		Price:     make(map[string]float64),
		Inventory: make(map[string]int),
	}

	var priceUSD *float64
	var b2bJSON, traceJSON, sciJSON, seoJSON, dimsJSON []byte
	var weightKG *float64
	var moqWholesale *int
	var inventoryRetail, inventoryWholesale int
	var priceINR float64

	err := rows.Scan(
		&p.ID, &p.Name, &p.Slug, &p.Category, &p.Subcategory, &p.Description,
		&priceINR, &priceUSD, &b2bJSON, &traceJSON, &sciJSON,
		&p.Images, &seoJSON, &inventoryRetail, &inventoryWholesale,
		&moqWholesale, &weightKG, &dimsJSON, &p.Status, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("scan product: %w", err)
	}

	p.Price["inr"] = priceINR
	if priceUSD != nil {
		p.Price["usd"] = *priceUSD
	}

	p.Inventory["retail"] = inventoryRetail
	p.Inventory["wholesale"] = inventoryWholesale

	if moqWholesale != nil {
		p.MOQ = map[string]int{"wholesale": *moqWholesale}
	}
	if weightKG != nil {
		p.WeightKG = weightKG
	}

	if b2bJSON != nil {
		_ = json.Unmarshal(b2bJSON, &p.B2BPricing)
	}
	if traceJSON != nil {
		p.Traceability = &model.Traceability{}
		_ = json.Unmarshal(traceJSON, p.Traceability)
	}
	if sciJSON != nil {
		_ = json.Unmarshal(sciJSON, &p.ScientificAttributes)
	}
	if seoJSON != nil {
		p.SEO = &model.ProductSEO{}
		_ = json.Unmarshal(seoJSON, p.SEO)
	}
	if dimsJSON != nil {
		p.DimensionsCM = &model.Dimensions{}
		_ = json.Unmarshal(dimsJSON, p.DimensionsCM)
	}

	return p, nil
}
