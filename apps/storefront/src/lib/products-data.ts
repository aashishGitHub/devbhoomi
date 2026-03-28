/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  Unified Product Data Access Layer                                   │
 * │                                                                      │
 * │  Controls whether the app uses mock (local) data or the real         │
 * │  Go backend API. Switch is baked in at build time via the env var.   │
 * │                                                                      │
 * │  MOCK MODE (Cloudflare static demo):                                 │
 * │    NEXT_PUBLIC_USE_MOCK=true                                          │
 * │                                                                      │
 * │  REAL API MODE (production with Go backend):                          │
 * │    NEXT_PUBLIC_USE_MOCK=false   (or remove the variable)             │
 * │    NEXT_PUBLIC_API_URL=https://api.devbhoomi.com                     │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import { mockProductsApi } from "./mock/api";
import { productsApi } from "./api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/**
 * Drop-in replacement for `productsApi`. Used in all server components
 * (FeaturedProducts, ProductGrid, RelatedProducts, [slug] page).
 *
 * When USE_MOCK is true  → reads from src/lib/mock/data.ts
 * When USE_MOCK is false → fetches from the Go API at NEXT_PUBLIC_API_URL
 */
export const productService = USE_MOCK ? mockProductsApi : productsApi;

/** All mock slugs — used by generateStaticParams when building for Cloudflare */
export { MOCK_PRODUCTS } from "./mock/data";
