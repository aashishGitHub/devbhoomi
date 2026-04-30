import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SearchBar } from "@/components/product/SearchBar";
import { SortSelect } from "@/components/product/SortSelect";
import { CategoryHero } from "@/components/product/CategoryHero";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full collection of sacred items, organic Himalayan foods, and heritage wellness products.",
};

export default function ProductsPage() {
  return (
    <>
      {/* Category Hero — full-width, reads ?category / ?q from URL */}
      <Suspense
        fallback={
          <div className="min-h-[400px] bg-[#091519] animate-pulse" />
        }
      >
        <CategoryHero />
      </Suspense>

      {/* Products listing */}
      <div className="bg-cream">
        <div className="section py-8">
          {/* Search + Sort row */}
          <Suspense fallback={<div className="h-10 bg-muted/10 rounded animate-pulse mb-6" />}>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1">
                <SearchBar />
              </div>
              <SortSelect />
            </div>
          </Suspense>

          <div className="flex gap-8">
            {/* Sidebar filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Suspense fallback={<div className="w-64 h-48 bg-muted/10 rounded animate-pulse" />}>
                <ProductFilters />
              </Suspense>
            </aside>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="rounded-2xl bg-muted/10 animate-pulse h-72" />
                    ))}
                  </div>
                }
              >
                <ProductGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
