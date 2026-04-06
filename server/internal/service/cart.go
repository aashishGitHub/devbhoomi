package service

import (
	"context"
	"errors"

	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/repository"
)

type CartService struct {
	repo     *repository.CartRepository
	products *repository.ProductRepository
}

func NewCartService(repo *repository.CartRepository, products *repository.ProductRepository) *CartService {
	return &CartService{repo: repo, products: products}
}

func (s *CartService) Get(ctx context.Context, userID, sessionID string) (*model.CartResponse, error) {
	cart, err := s.getOrCreate(ctx, userID, sessionID)
	if err != nil {
		return nil, err
	}
	resp := model.NewCartResponse(cart)
	return &resp, nil
}

func (s *CartService) AddItem(ctx context.Context, userID, sessionID, productID string, quantity int, isWholesaler bool) (*model.CartResponse, error) {
	product, err := s.products.GetByID(ctx, productID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, errors.New("product not found")
		}
		return nil, err
	}
	if product.Status == model.StatusOutOfStock {
		return nil, errors.New("product is out of stock")
	}

	price := product.Price["inr"]
	if isWholesaler && len(product.B2BPricing) > 0 {
		price = CalcB2BPrice(product, quantity)
	}

	image := ""
	if len(product.Images) > 0 {
		image = product.Images[0]
	}

	cart, err := s.getOrCreate(ctx, userID, sessionID)
	if err != nil {
		return nil, err
	}

	item := &model.CartItem{
		ProductID: productID,
		Name:      product.Name,
		Slug:      product.Slug,
		Image:     image,
		PriceINR:  price,
		Quantity:  quantity,
	}

	if _, err := s.repo.UpsertItem(ctx, cart.ID, item); err != nil {
		return nil, err
	}

	return s.Get(ctx, userID, sessionID)
}

func (s *CartService) UpdateItem(ctx context.Context, userID, sessionID, itemID string, quantity int) (*model.CartResponse, error) {
	cart, err := s.getOrCreate(ctx, userID, sessionID)
	if err != nil {
		return nil, err
	}

	if quantity <= 0 {
		if err := s.repo.RemoveItem(ctx, cart.ID, itemID); err != nil && !errors.Is(err, repository.ErrNotFound) {
			return nil, err
		}
		return s.Get(ctx, userID, sessionID)
	}

	if _, err := s.repo.UpdateItemQuantity(ctx, cart.ID, itemID, quantity); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, errors.New("cart item not found")
		}
		return nil, err
	}

	return s.Get(ctx, userID, sessionID)
}

func (s *CartService) RemoveItem(ctx context.Context, userID, sessionID, itemID string) (*model.CartResponse, error) {
	cart, err := s.getOrCreate(ctx, userID, sessionID)
	if err != nil {
		return nil, err
	}
	if err := s.repo.RemoveItem(ctx, cart.ID, itemID); err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}
	return s.Get(ctx, userID, sessionID)
}

func (s *CartService) MergeOnLogin(ctx context.Context, sessionID, userID string) error {
	if sessionID == "" {
		return nil
	}
	return s.repo.MergeGuestCart(ctx, sessionID, userID)
}

func (s *CartService) getOrCreate(ctx context.Context, userID, sessionID string) (*model.Cart, error) {
	var cart *model.Cart
	var err error

	if userID != "" {
		cart, err = s.repo.GetByUserID(ctx, userID)
	} else if sessionID != "" {
		cart, err = s.repo.GetBySessionID(ctx, sessionID)
	}

	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}
	if cart == nil {
		cart, err = s.repo.Create(ctx, userID, sessionID)
	}
	return cart, err
}
