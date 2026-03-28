"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatINR, getB2BDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, MapPin, Award, Minus, Plus } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const isOutOfStock = product.status === "out_of_stock";
  const b2bDiscount =
    product.b2b_pricing ? getB2BDiscount(qty, product.b2b_pricing) : 0;

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] ?? "",
        price_inr: product.price.inr,
        quantity: 1,
      });
    }
    openCart();
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Category + status */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant={
            product.category === "sacred"
              ? "heritage"
              : product.category === "foods"
              ? "organic"
              : "new"
          }
        >
          {product.category === "sacred"
            ? "Heritage Sacred"
            : product.category === "foods"
            ? "Organic Food"
            : "Wellness"}
        </Badge>
        {isOutOfStock && <Badge variant="outofstock" />}
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold text-forest leading-tight">
        {product.name}
      </h1>

      {/* Origin */}
      {product.traceability?.village_of_origin && (
        <div className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
          {product.traceability.village_of_origin}
          {product.traceability.artisan_name && (
            <span>· by {product.traceability.artisan_name}</span>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-forest/70 leading-relaxed">{product.description}</p>

      {/* Price */}
      <div className="bg-cream rounded-2xl p-4 border border-muted/20">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-forest">
            {formatINR(product.price.inr)}
          </span>
          {product.price.usd && (
            <span className="text-sm text-muted">≈ ${product.price.usd}</span>
          )}
        </div>
        {b2bDiscount > 0 && (
          <p className="text-xs text-green-700 font-medium mt-1">
            {b2bDiscount}% B2B discount applied for {qty}+ units
          </p>
        )}
        <p className="text-xs text-muted mt-1">Inclusive of all taxes</p>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-forest/70">Qty:</span>
        <div className="flex items-center gap-2 border border-muted/40 rounded-xl p-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-7 h-7 rounded-lg bg-cream hover:bg-muted/20 flex items-center justify-center transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-forest">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-7 h-7 rounded-lg bg-cream hover:bg-muted/20 flex items-center justify-center transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
          </button>
        </div>

        {product.moq?.wholesale && (
          <span className="text-xs text-muted">
            MOQ {product.moq.wholesale} for wholesale
          </span>
        )}
      </div>

      {/* Add to cart */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        <ShoppingBag className="w-5 h-5" aria-hidden="true" />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>

      {/* Certification */}
      {product.traceability?.certification_id && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          NPOP Certified · {product.traceability.certification_id}
        </div>
      )}
    </div>
  );
}
