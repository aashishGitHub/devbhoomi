import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SearchBar } from "@/components/product/SearchBar";
import { SortSelect } from "@/components/product/SortSelect";
import { ProductPageTitle } from "@/components/product/ProductPageTitle";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full collection of sacred items, organic Himalayan foods, and heritage wellness products.",
};

// Static page — ProductGrid and ProductPageTitle are client components
// that read URL params via useSearchParams() in the browser.
// This allows filtering to work in both Cloudflare Pages (static export)
// and Vercel (SSR) without server-side searchParams.
export default function ProductsPage() {
  return (
    <div className="section py-8">
      {/* Page header — client component reads ?category from URL */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-9 w-48 bg-muted/10 rounded animate-pulse" />}>
          <ProductPageTitle />
        </Suspense>
        <p className="text-forest/60 text-sm mt-1">
          Authentic Himalayan products, directly sourced
        </p>
      </div>

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

        {/* Product grid — client component, reads URL params */}
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
  );
}
