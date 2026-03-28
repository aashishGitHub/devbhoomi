"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductTabsProps {
  product: Product;
}

const TABS = ["Description", "Origin & Traceability", "Scientific Attributes"] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <div className="border border-muted/20 rounded-3xl overflow-hidden mb-12">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-muted/20 bg-cream">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px]",
              active === tab
                ? "border-forest text-forest bg-snow"
                : "border-transparent text-forest/50 hover:text-forest hover:bg-snow/50"
            )}
            aria-selected={active === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 bg-snow">
        {active === "Description" && (
          <p className="text-forest/80 leading-relaxed">
            {product.description}
          </p>
        )}

        {active === "Origin & Traceability" && (
          <div className="space-y-3">
            {product.traceability ? (
              <>
                <Row label="Village of Origin" value={product.traceability.village_of_origin} />
                {product.traceability.artisan_name && (
                  <Row label="Artisan" value={product.traceability.artisan_name} />
                )}
                {product.traceability.certification_id && (
                  <Row label="Certification ID" value={product.traceability.certification_id} />
                )}
              </>
            ) : (
              <p className="text-forest/50 text-sm">
                Traceability information will be available soon.
              </p>
            )}
          </div>
        )}

        {active === "Scientific Attributes" && (
          <div className="space-y-3">
            {product.scientific_attributes &&
            Object.keys(product.scientific_attributes).length > 0 ? (
              Object.entries(product.scientific_attributes).map(([key, value]) => (
                <Row
                  key={key}
                  label={key.replace(/_/g, " ")}
                  value={String(value)}
                />
              ))
            ) : (
              <p className="text-forest/50 text-sm">
                Scientific attributes will be added soon.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-2 border-b border-muted/10 last:border-0">
      <span className="text-xs font-semibold text-forest/50 uppercase tracking-wider w-40 shrink-0 mt-0.5">
        {label}
      </span>
      <span className="text-sm text-forest">{value}</span>
    </div>
  );
}
