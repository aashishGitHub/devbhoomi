const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function getToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|; )admin_token=([^;]*)/);
    return match ? match[1] : null;
}

function clearTokenAndRedirect() {
    document.cookie = "admin_token=; path=/; max-age=0";
    window.location.href = "/login";
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = getToken();
    if (!token) {
        clearTokenAndRedirect();
        throw new Error("Not authenticated");
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options?.headers,
        },
    });

    if (res.status === 401 || res.status === 403) {
        clearTokenAndRedirect();
        throw new Error("Session expired");
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `Request failed (${res.status})`);
    }

    return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductVariant {
    name: string;
    price_inr: number;
    price_usd?: number;
    inventory: number;
    sku?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    subcategory: string;
    description: string;
    price: { inr: number; usd?: number };
    variants?: ProductVariant[];
    b2b_pricing?: { min_qty: number; max_qty?: number; discount_pct: number }[];
    traceability?: { village_of_origin: string; artisan_name?: string; certification_id?: string };
    images: string[];
    inventory?: { retail: number; wholesale: number };
    status: string;
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

export interface Order {
    id: string;
    user_id?: string;
    status: string;
    items: { product_id: string; name: string; price_inr: number; quantity: number }[];
    subtotal_inr: number;
    shipping_inr: number;
    total_inr: number;
    payment_status: string;
    created_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    created_at: string;
}

export interface DashboardStats {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    low_stock_count: number;
}

// ── API functions ─────────────────────────────────────────────────────────────

export const adminApi = {
    getDashboardStats: () => apiFetch<DashboardStats>("/api/v1/admin/dashboard/stats"),

    // Products
    listProducts: (params?: { page?: number; per_page?: number; q?: string; category?: string }) => {
        const sp = new URLSearchParams();
        if (params?.page) sp.set("page", String(params.page));
        if (params?.per_page) sp.set("per_page", String(params.per_page));
        if (params?.q) sp.set("q", params.q);
        if (params?.category) sp.set("category", params.category);
        return apiFetch<ProductListResponse>(`/api/v1/admin/products?${sp}`);
    },
    getProduct: (id: string) => apiFetch<Product>(`/api/v1/admin/products/${id}`),
    createProduct: (data: Record<string, unknown>) =>
        apiFetch<Product>("/api/v1/admin/products", { method: "POST", body: JSON.stringify(data) }),
    updateProduct: (id: string, data: Record<string, unknown>) =>
        apiFetch<Product>(`/api/v1/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteProduct: (id: string) =>
        apiFetch<{ message: string }>(`/api/v1/admin/products/${id}`, { method: "DELETE" }),
    updateInventory: (id: string, retail: number, wholesale: number) =>
        apiFetch<{ message: string }>(`/api/v1/admin/products/${id}/inventory`, {
            method: "PUT",
            body: JSON.stringify({ inventory_retail: retail, inventory_wholesale: wholesale }),
        }),

    // Orders
    listOrders: (page = 1) =>
        apiFetch<{ items: Order[]; total: number; page: number; per_page: number; total_pages: number }>(
            `/api/v1/admin/orders?page=${page}`
        ),
    updateOrderStatus: (id: string, status: string) =>
        apiFetch<{ message: string }>(`/api/v1/admin/orders/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),

    // Customers
    listCustomers: (page = 1) =>
        apiFetch<{ items: User[]; total: number; page: number; per_page: number; total_pages: number }>(
            `/api/v1/admin/customers?page=${page}`
        ),

    // Wholesalers
    listWholesalers: () =>
        apiFetch<{ items: { user_id: string; company_name: string; gstin: string; tier: string; approval_status: string; created_at: string }[] }>(
            "/api/v1/admin/wholesalers"
        ),
    approveWholesaler: (id: string, status: "approved" | "rejected") =>
        apiFetch<{ message: string }>(`/api/v1/admin/wholesalers/${id}/approve`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),
};
