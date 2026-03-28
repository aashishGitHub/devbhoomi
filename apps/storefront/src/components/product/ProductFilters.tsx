"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";


const CATEGORIES = [
  { value: "", label: "All Products" },
  { value: "sacred", label: "🙏 Sacred" },
  { value: "foods", label: "🍯 Foods" },
  { value: "wellness", label: "🌿 Wellness" },
];

const PRICE_RANGES = [
  { label: "All prices", min: "", max: "" },
  { label: "Under ₹500", min: "", max: "500" },
  { label: "₹500 – ₹2,000", min: "500", max: "2000" },
  { label: "₹2,000 – ₹5,000", min: "2000", max: "5000" },
  { label: "Above ₹5,000", min: "5000", max: "" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeMin = searchParams.get("min_price") ?? "";
  const activeMax = searchParams.get("max_price") ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 whenever filter changes
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold text-forest/60 uppercase tracking-wider mb-3">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateFilter("category", value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === value
                  ? "bg-forest/10 text-forest"
                  : "text-forest/60 hover:text-forest hover:bg-forest/5"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-semibold text-forest/60 uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map(({ label, min, max }) => {
            const isActive =
              activeMin === min && activeMax === max;
            return (
              <button
                key={label}
                onClick={() => {
                  updateFilter("min_price", min);
                  updateFilter("max_price", max);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-forest/10 text-forest"
                    : "text-forest/60 hover:text-forest hover:bg-forest/5"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
