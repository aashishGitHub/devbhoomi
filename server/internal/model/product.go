package model

import "time"

type ProductCategory string

const (
	CategorySacred   ProductCategory = "sacred"
	CategoryFoods    ProductCategory = "foods"
	CategoryWellness ProductCategory = "wellness"
)

type ProductStatus string

const (
	StatusActive     ProductStatus = "active"
	StatusInactive   ProductStatus = "inactive"
	StatusOutOfStock ProductStatus = "out_of_stock"
)

type B2BPricingTier struct {
	MinQty      int     `json:"min_qty"`
	MaxQty      *int    `json:"max_qty,omitempty"`
	DiscountPct float64 `json:"discount_pct"`
}

type Traceability struct {
	VillageOfOrigin string  `json:"village_of_origin"`
	ArtisanName     *string `json:"artisan_name,omitempty"`
	CertificationID *string `json:"certification_id,omitempty"`
}

type ProductVariant struct {
	Name      string  `json:"name"`
	PriceINR  float64 `json:"price_inr"`
	PriceUSD  float64 `json:"price_usd,omitempty"`
	Inventory int     `json:"inventory"`
	SKU       string  `json:"sku,omitempty"`
}

type ProductSEO struct {
	Title       *string  `json:"title,omitempty"`
	Description *string  `json:"description,omitempty"`
	Keywords    []string `json:"keywords,omitempty"`
}

type Dimensions struct {
	L float64 `json:"l"`
	W float64 `json:"w"`
	H float64 `json:"h"`
}

type Product struct {
	ID                   string                 `json:"id"`
	Name                 string                 `json:"name"`
	Slug                 string                 `json:"slug"`
	Category             ProductCategory        `json:"category"`
	Subcategory          string                 `json:"subcategory"`
	Description          string                 `json:"description"`
	Price                map[string]float64     `json:"price"`
	Variants             []ProductVariant       `json:"variants,omitempty"`
	B2BPricing           []B2BPricingTier       `json:"b2b_pricing,omitempty"`
	Traceability         *Traceability          `json:"traceability,omitempty"`
	ScientificAttributes map[string]interface{} `json:"scientific_attributes,omitempty"`
	Images               []string               `json:"images"`
	SEO                  *ProductSEO            `json:"seo,omitempty"`
	Inventory            map[string]int         `json:"inventory,omitempty"`
	MOQ                  map[string]int         `json:"moq,omitempty"`
	WeightKG             *float64               `json:"weight_kg,omitempty"`
	DimensionsCM         *Dimensions            `json:"dimensions_cm,omitempty"`
	Status               ProductStatus          `json:"status"`
	CreatedAt            time.Time              `json:"created_at"`
	UpdatedAt            time.Time              `json:"updated_at"`
}

type ProductListResponse struct {
	Items      []Product `json:"items"`
	Total      int       `json:"total"`
	Page       int       `json:"page"`
	PerPage    int       `json:"per_page"`
	TotalPages int       `json:"total_pages"`
}

type ProductSearchParams struct {
	Q        string
	Category string
	Sort     string
	MinPrice *float64
	MaxPrice *float64
	Page     int
	PerPage  int
}
