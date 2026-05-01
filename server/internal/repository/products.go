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
	weight_kg, dimensions_cm, status, created_at, updated_at, variants`

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

// ListAll returns all products regardless of status (for admin).
func (r *ProductRepository) ListAll(ctx context.Context, params model.ProductSearchParams) ([]model.Product, int, error) {
	args := []interface{}{}
	conditions := []string{"1=1"}
	i := 1

	if params.Category != "" {
		args = append(args, params.Category)
		conditions = append(conditions, fmt.Sprintf("category = $%d", i))
		i++
	}
	if params.Q != "" {
		args = append(args, "%"+params.Q+"%")
		conditions = append(conditions, fmt.Sprintf("(name ILIKE $%d OR description ILIKE $%d)", i, i))
		i++
	}

	where := strings.Join(conditions, " AND ")

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
		ORDER BY created_at DESC LIMIT $%d OFFSET $%d`,
		productColumns, where, i, i+1)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("list all products: %w", err)
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

func (r *ProductRepository) Create(ctx context.Context, p *model.Product) error {
	b2bJSON, _ := json.Marshal(p.B2BPricing)
	if p.B2BPricing == nil {
		b2bJSON = []byte("[]")
	}
	var traceJSON []byte
	if p.Traceability != nil {
		traceJSON, _ = json.Marshal(p.Traceability)
	}
	sciJSON, _ := json.Marshal(p.ScientificAttributes)
	if p.ScientificAttributes == nil {
		sciJSON = []byte("{}")
	}
	var seoJSON []byte
	if p.SEO != nil {
		seoJSON, _ = json.Marshal(p.SEO)
	}
	var dimsJSON []byte
	if p.DimensionsCM != nil {
		dimsJSON, _ = json.Marshal(p.DimensionsCM)
	}
	variantsJSON, _ := json.Marshal(p.Variants)
	if p.Variants == nil {
		variantsJSON = []byte("[]")
	}

	priceINR := p.Price["inr"]
	var priceUSD *float64
	if v, ok := p.Price["usd"]; ok {
		priceUSD = &v
	}

	inventoryRetail := p.Inventory["retail"]
	inventoryWholesale := p.Inventory["wholesale"]
	var moqWholesale *int
	if v, ok := p.MOQ["wholesale"]; ok {
		moqWholesale = &v
	}

	images := p.Images
	if images == nil {
		images = []string{}
	}

	return r.db.QueryRow(ctx, `
		INSERT INTO products (
			name, slug, category, subcategory, description,
			price_inr, price_usd, b2b_pricing, traceability, scientific_attributes,
			images, seo, inventory_retail, inventory_wholesale, moq_wholesale,
			weight_kg, dimensions_cm, status, variants
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
		RETURNING id, created_at, updated_at`,
		p.Name, p.Slug, p.Category, p.Subcategory, p.Description,
		priceINR, priceUSD, b2bJSON, traceJSON, sciJSON,
		images, seoJSON, inventoryRetail, inventoryWholesale, moqWholesale,
		p.WeightKG, dimsJSON, p.Status, variantsJSON,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
}

func (r *ProductRepository) Update(ctx context.Context, p *model.Product) error {
	b2bJSON, _ := json.Marshal(p.B2BPricing)
	if p.B2BPricing == nil {
		b2bJSON = []byte("[]")
	}
	var traceJSON []byte
	if p.Traceability != nil {
		traceJSON, _ = json.Marshal(p.Traceability)
	}
	sciJSON, _ := json.Marshal(p.ScientificAttributes)
	if p.ScientificAttributes == nil {
		sciJSON = []byte("{}")
	}
	var seoJSON []byte
	if p.SEO != nil {
		seoJSON, _ = json.Marshal(p.SEO)
	}
	var dimsJSON []byte
	if p.DimensionsCM != nil {
		dimsJSON, _ = json.Marshal(p.DimensionsCM)
	}
	variantsJSON, _ := json.Marshal(p.Variants)
	if p.Variants == nil {
		variantsJSON = []byte("[]")
	}

	priceINR := p.Price["inr"]
	var priceUSD *float64
	if v, ok := p.Price["usd"]; ok {
		priceUSD = &v
	}

	inventoryRetail := p.Inventory["retail"]
	inventoryWholesale := p.Inventory["wholesale"]
	var moqWholesale *int
	if v, ok := p.MOQ["wholesale"]; ok {
		moqWholesale = &v
	}

	images := p.Images
	if images == nil {
		images = []string{}
	}

	_, err := r.db.Exec(ctx, `
		UPDATE products SET
			name=$1, slug=$2, category=$3, subcategory=$4, description=$5,
			price_inr=$6, price_usd=$7, b2b_pricing=$8, traceability=$9, scientific_attributes=$10,
			images=$11, seo=$12, inventory_retail=$13, inventory_wholesale=$14, moq_wholesale=$15,
			weight_kg=$16, dimensions_cm=$17, status=$18, variants=$19, updated_at=NOW()
		WHERE id=$20`,
		p.Name, p.Slug, p.Category, p.Subcategory, p.Description,
		priceINR, priceUSD, b2bJSON, traceJSON, sciJSON,
		images, seoJSON, inventoryRetail, inventoryWholesale, moqWholesale,
		p.WeightKG, dimsJSON, p.Status, variantsJSON,
		p.ID,
	)
	return err
}

func (r *ProductRepository) Delete(ctx context.Context, id string) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM products WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete product: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *ProductRepository) UpdateInventory(ctx context.Context, id string, retail, wholesale int) error {
	status := "active"
	if retail <= 0 && wholesale <= 0 {
		status = "out_of_stock"
	}
	_, err := r.db.Exec(ctx, `
		UPDATE products SET inventory_retail=$1, inventory_wholesale=$2, status=$3, updated_at=NOW()
		WHERE id=$4`, retail, wholesale, status, id)
	return err
}

func scanProductRow(rows pgx.Rows) (*model.Product, error) {
	p := &model.Product{
		Price:     make(map[string]float64),
		Inventory: make(map[string]int),
	}

	var priceUSD *float64
	var b2bJSON, traceJSON, sciJSON, seoJSON, dimsJSON, variantsJSON []byte
	var weightKG *float64
	var moqWholesale *int
	var inventoryRetail, inventoryWholesale int
	var priceINR float64

	err := rows.Scan(
		&p.ID, &p.Name, &p.Slug, &p.Category, &p.Subcategory, &p.Description,
		&priceINR, &priceUSD, &b2bJSON, &traceJSON, &sciJSON,
		&p.Images, &seoJSON, &inventoryRetail, &inventoryWholesale,
		&moqWholesale, &weightKG, &dimsJSON, &p.Status, &p.CreatedAt, &p.UpdatedAt,
		&variantsJSON,
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
	if variantsJSON != nil {
		_ = json.Unmarshal(variantsJSON, &p.Variants)
	}

	return p, nil
}
