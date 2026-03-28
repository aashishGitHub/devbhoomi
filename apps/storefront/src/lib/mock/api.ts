/**
 * Mock implementation of productsApi — mirrors the exact interface of
 * src/lib/api.ts so it can be swapped in without any component changes.
 *
 * ─ Replace with real API calls by unsetting NEXT_PUBLIC_USE_MOCK ─
 */

import { MOCK_PRODUCTS, MOCK_PRODUCTS_BY_SLUG } from "./data";
import type { Product, ProductListResponse, ProductSearchParams } from "@/types/product";

const PER_PAGE = 12;

/** Simulate a small network delay in development so loading states are visible */
function noop(_opts?: RequestInit) { }

export const mockProductsApi = {
    async list(
        params: ProductSearchParams,
        opts?: RequestInit
    ): Promise<ProductListResponse> {
        noop(opts);

        let items = [...MOCK_PRODUCTS];

        // Filter by category
        if (params.category) {
            items = items.filter((p) => p.category === params.category);
        }

        // Full-text search across name + description
        if (params.q) {
            const q = params.q.toLowerCase();
            items = items.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.subcategory.toLowerCase().includes(q)
            );
        }

        // Price range
        if (params.min_price) {
            const min = Number(params.min_price);
            items = items.filter((p) => p.price.inr >= min);
        }
        if (params.max_price) {
            const max = Number(params.max_price);
            items = items.filter((p) => p.price.inr <= max);
        }

        // Sort
        switch (params.sort) {
            case "price_asc":
                items.sort((a, b) => a.price.inr - b.price.inr);
                break;
            case "price_desc":
                items.sort((a, b) => b.price.inr - a.price.inr);
                break;
            case "newest":
                items.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
                break;
            default:
                // "featured" — keep insertion order (already curated)
                break;
        }

        const total = items.length;
        const page = Math.max(1, Number(params.page ?? 1));
        const start = (page - 1) * PER_PAGE;

        return {
            items: items.slice(start, start + PER_PAGE),
            total,
            page,
            per_page: PER_PAGE,
            total_pages: Math.max(1, Math.ceil(total / PER_PAGE)),
        };
    },

    async get(slug: string, _opts?: RequestInit): Promise<Product> {
        const product = MOCK_PRODUCTS_BY_SLUG.get(slug);
        if (!product) {
            throw new Error(`Product not found: ${slug}`);
        }
        return product;
    },

    async search(q: string, opts?: RequestInit): Promise<ProductListResponse> {
        return this.list({ q }, opts);
    },
};
