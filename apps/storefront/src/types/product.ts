export interface Product {
    id: string;
    name: string;
    slug: string;
    category: "sacred" | "foods" | "wellness";
    subcategory: string;
    description: string;
    price: {
        inr: number;
        usd?: number;
    };
    b2b_pricing?: Array<{
        min_qty: number;
        max_qty?: number;
        discount_pct: number;
    }>;
    traceability?: {
        village_of_origin: string;
        artisan_name?: string;
        certification_id?: string;
    };
    scientific_attributes?: Record<string, string | number | boolean>;
    images: string[];
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    inventory?: {
        retail: number;
        wholesale: number;
    };
    moq?: { wholesale: number };
    weight_kg?: number;
    dimensions_cm?: { l: number; w: number; h: number };
    status: "active" | "inactive" | "out_of_stock";
    created_at: string;
    updated_at: string;
}

export interface ProductListResponse {
    items: Product[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface ProductSearchParams {
    q?: string;
    category?: string;
    sort?: string;
    min_price?: string;
    max_price?: string;
    page?: string;
}
