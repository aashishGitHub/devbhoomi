"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  compact?: boolean;
}

export function SearchBar({ defaultValue = "", compact = false }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleChange = useCallback(
    (q: string) => {
      setValue(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (q) {
          params.set("q", q);
        } else {
          params.delete("q");
        }
        params.delete("page");
        router.push(`/products?${params.toString()}`);
      }, 350);
    },
    [router, searchParams]
  );

  function clear() {
    handleChange("");
  }

  return (
    <div className="relative">
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-muted",
          compact ? "w-4 h-4" : "w-4.5 h-4.5"
        )}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search products, herbs, rituals…"
        className={cn(
          "w-full rounded-xl border border-muted/40 bg-snow text-sm text-forest placeholder:text-muted/60",
          "pl-9 pr-9 transition-colors focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent",
          compact ? "py-2" : "py-2.5"
        )}
        aria-label="Search products"
      />
      {value && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-forest transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
