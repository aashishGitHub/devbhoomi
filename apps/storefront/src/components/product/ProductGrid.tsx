"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productService } from "@/lib/products-data";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

// Client component — reads URL search params in-browser so it works in both
// static export (Cloudflare Pages) and SSR (Vercel + real backend) modes.
// productService auto-switches between mock data and the real Go API based
// on NEXT_PUBLIC_USE_MOCK baked in at build time.
export function ProductGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService
      .list({
        category: searchParams.get("category") ?? undefined,
        q: searchParams.get("q") ?? undefined,
        sort: searchParams.get("sort") ?? undefined,
        min_price: searchParams.get("min_price") ?? undefined,
        max_price: searchParams.get("max_price") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
      .then((data) => {
        setProducts(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted/10 animate-pulse h-72" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-4xl mb-4" aria-hidden="true">🔍</p>
        <p className="text-lg font-semibold text-forest mb-2">No products found</p>
        <p className="text-sm text-forest/60">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-forest/50 mb-4">
        {total} product{total !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
