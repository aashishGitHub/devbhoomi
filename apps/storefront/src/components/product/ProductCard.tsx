"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, MapPin } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] ?? "",
      price_inr: product.price.inr,
      quantity: 1,
    });
    openCart();
  }

  const isOutOfStock = product.status === "out_of_stock" || (product.inventory?.retail === 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative bg-snow rounded-2xl border border-muted/20 overflow-hidden transition-shadow duration-200 hover:shadow-card-hover flex flex-col"
      aria-label={product.name}
    >
      {/* Image */}
      <div className="relative aspect-square bg-cream overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-muted/50" aria-hidden="true">
            {product.category === "sacred" ? "🙏" : product.category === "foods" ? "🍯" : "🌿"}
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <Badge
            variant={
              product.category === "sacred"
                ? "heritage"
                : product.category === "foods"
                ? "organic"
                : "new"
            }
          />
          {isOutOfStock && <Badge variant="outofstock" />}
        </div>

        {/* Quick add overlay — desktop */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 p-2 hidden sm:block">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-forest text-snow text-xs font-semibold py-2.5 rounded-lg hover:bg-forest/90 transition-colors disabled:opacity-50"
            aria-label={`Add ${product.name} to cart`}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        {/* Origin */}
        {product.traceability?.village_of_origin && (
          <div className="flex items-center gap-1 text-[10px] text-muted font-medium">
            <MapPin className="w-2.5 h-2.5" aria-hidden="true" />
            {product.traceability.village_of_origin}
          </div>
        )}

        <h3 className="text-sm font-semibold text-forest leading-tight line-clamp-2 group-hover:text-stone transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-base font-bold text-forest">
              {formatINR(product.price.inr)}
            </span>
            {product.price.usd && (
              <span className="text-xs text-muted ml-1">
                / ${product.price.usd}
              </span>
            )}
          </div>

          {/* Mobile add button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="sm:hidden w-8 h-8 rounded-lg bg-forest text-snow flex items-center justify-center hover:bg-stone transition-colors disabled:opacity-40"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Link>
  );
}
