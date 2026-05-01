package service

import (
	"context"
	"math"

	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/repository"
)

type ProductService struct {
	repo *repository.ProductRepository
}

func NewProductService(repo *repository.ProductRepository) *ProductService {
	return &ProductService{repo: repo}
}

func (s *ProductService) List(ctx context.Context, params model.ProductSearchParams) (*model.ProductListResponse, error) {
	if params.PerPage == 0 {
		params.PerPage = 20
	}
	if params.Page == 0 {
		params.Page = 1
	}

	products, total, err := s.repo.List(ctx, params)
	if err != nil {
		return nil, err
	}
	if products == nil {
		products = []model.Product{}
	}

	totalPages := int(math.Ceil(float64(total) / float64(params.PerPage)))
	if totalPages == 0 {
		totalPages = 1
	}

	return &model.ProductListResponse{
		Items:      products,
		Total:      total,
		Page:       params.Page,
		PerPage:    params.PerPage,
		TotalPages: totalPages,
	}, nil
}

func (s *ProductService) GetBySlug(ctx context.Context, slug string) (*model.Product, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *ProductService) GetByID(ctx context.Context, id string) (*model.Product, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *ProductService) Search(ctx context.Context, q string) (*model.ProductListResponse, error) {
	return s.List(ctx, model.ProductSearchParams{Q: q, Page: 1, PerPage: 20})
}

func (s *ProductService) ListAll(ctx context.Context, params model.ProductSearchParams) (*model.ProductListResponse, error) {
	if params.PerPage == 0 {
		params.PerPage = 20
	}
	if params.Page == 0 {
		params.Page = 1
	}

	products, total, err := s.repo.ListAll(ctx, params)
	if err != nil {
		return nil, err
	}
	if products == nil {
		products = []model.Product{}
	}

	totalPages := int(math.Ceil(float64(total) / float64(params.PerPage)))
	if totalPages == 0 {
		totalPages = 1
	}

	return &model.ProductListResponse{
		Items:      products,
		Total:      total,
		Page:       params.Page,
		PerPage:    params.PerPage,
		TotalPages: totalPages,
	}, nil
}

func (s *ProductService) Create(ctx context.Context, p *model.Product) error {
	return s.repo.Create(ctx, p)
}

func (s *ProductService) Update(ctx context.Context, p *model.Product) error {
	return s.repo.Update(ctx, p)
}

func (s *ProductService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *ProductService) UpdateInventory(ctx context.Context, id string, retail, wholesale int) error {
	return s.repo.UpdateInventory(ctx, id, retail, wholesale)
}

// CalcB2BPrice returns the effective unit price for a wholesaler given quantity.
func CalcB2BPrice(product *model.Product, quantity int) float64 {
	base := product.Price["inr"]
	if len(product.B2BPricing) == 0 {
		return base
	}
	for _, tier := range product.B2BPricing {
		if quantity < tier.MinQty {
			continue
		}
		if tier.MaxQty != nil && quantity > *tier.MaxQty {
			continue
		}
		return base * (1 - tier.DiscountPct/100)
	}
	return base
}
