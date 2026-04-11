import type { MetadataRoute } from "next";
import { MOCK_PRODUCTS } from "@/lib/mock/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devtatva.com";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// Required for static export compatibility
export const dynamic = "force-static";

// Categories that always exist
const STATIC_CATEGORIES = ["sacred", "foods", "wellness"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // In mock/static mode use local data. In production fetch from Go API.
    let productSlugs: string[] = [];

    if (USE_MOCK) {
        productSlugs = MOCK_PRODUCTS.map((p) => p.slug);
    } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
        try {
            const res = await fetch(`${apiUrl}/api/v1/products?fields=slug&limit=1000`, {
                next: { revalidate: 3600 },
            });
            if (res.ok) {
                const data = await res.json();
                productSlugs = (data.items ?? []).map(
                    (p: { slug: string }) => p.slug
                );
            }
        } catch {
            // silently fall through — sitemap without products is better than no sitemap
        }
    }

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        },
        ...STATIC_CATEGORIES.map((cat) => ({
            url: `${BASE_URL}/products?category=${cat}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        })),
    ];

    const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
        url: `${BASE_URL}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes];
}
