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
  const [selectedVariant, setSelectedVariant] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariant = hasVariants ? product.variants![selectedVariant] : null;
  const activePrice = activeVariant ? activeVariant.price_inr : product.price.inr;
  const isOutOfStock = product.status === "out_of_stock" || (product.inventory?.retail === 0);
  const b2bDiscount =
    product.b2b_pricing ? getB2BDiscount(qty, product.b2b_pricing) : 0;

  function handleAddToCart() {
    const variantLabel = activeVariant ? ` (${activeVariant.name})` : "";
    for (let i = 0; i < qty; i++) {
      addItem({
        product_id: product.id,
        name: product.name + variantLabel,
        slug: product.slug,
        image: product.images?.[0] ?? "",
        price_inr: activePrice,
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

      {/* Stock status */}
      {product.inventory && (
        <div className="text-sm">
          {product.inventory.retail === 0 ? (
            <span className="text-red-600 font-semibold">sold out</span>
          ) : product.inventory.retail <= 10 ? (
            <span className="text-amber-600 font-medium">
              Only {product.inventory.retail} left in stock
            </span>
          ) : (
            <span className="text-green-700">In Stock</span>
          )}
        </div>
      )}

      {/* Variant selector */}
      {hasVariants && (
        <div className="flex flex-wrap gap-2">
          {product.variants!.map((v, i) => (
            <button
              key={v.name}
              onClick={() => setSelectedVariant(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                i === selectedVariant
                  ? "border-forest bg-forest/10 text-forest"
                  : "border-muted/30 text-forest/60 hover:border-forest/40"
              } ${v.inventory === 0 ? "opacity-50 line-through" : ""}`}
              disabled={v.inventory === 0}
            >
              {v.name} — {formatINR(v.price_inr)}
              {v.inventory === 0 && <span className="ml-1 text-red-500 no-underline">(sold out)</span>}
            </button>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="bg-cream rounded-2xl p-4 border border-muted/20">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-forest">
            {formatINR(activePrice)}
          </span>
          {product.price.usd && !hasVariants && (
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
