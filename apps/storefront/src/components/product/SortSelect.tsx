"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
];

interface SortSelectProps {
  defaultValue?: string;
}

export function SortSelect({ defaultValue = "featured" }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(
        "rounded-xl border border-muted/40 bg-snow text-sm text-forest px-3 py-2.5",
        "focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent",
        "cursor-pointer min-w-[160px]"
      )}
      aria-label="Sort products"
    >
      {SORT_OPTIONS.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
