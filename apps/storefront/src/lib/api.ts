import type { ProductListResponse, Product, ProductSearchParams } from "@/types/product";
import type { LoginPayload, RegisterPayload, AuthTokens, User, UpdateProfilePayload } from "@/types/user";
import type { Cart, CartItem } from "@/types/cart";
import type { Order, OrderListResponse, PlaceOrderPayload } from "@/types/order";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}/api/v1${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(error.message ?? `HTTP ${res.status}`);
    }

    return res.json();
}

function authHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
}

function sessionHeaders(sessionId?: string): Record<string, string> {
    return sessionId ? { "X-Cart-Session": sessionId } : {};
}

// ── Products ──────────────────────────────────────────────────────────────────

export const productsApi = {
    list(params: ProductSearchParams, opts?: RequestInit): Promise<ProductListResponse> {
        const qs = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
        ).toString();
        return request(`/products${qs ? `?${qs}` : ""}`, opts);
    },

    get(slug: string, opts?: RequestInit): Promise<Product> {
        return request(`/products/${slug}`, opts);
    },

    search(q: string, opts?: RequestInit): Promise<ProductListResponse> {
        return request(`/products/search?q=${encodeURIComponent(q)}`, opts);
    },
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
    login(payload: LoginPayload): Promise<AuthTokens> {
        return request("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    register(payload: RegisterPayload): Promise<AuthTokens> {
        return request("/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    refresh(refreshToken: string): Promise<AuthTokens> {
        return request("/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
    },
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const cartApi = {
    get(token?: string, sessionId?: string): Promise<Cart> {
        return request("/cart", {
            headers: { ...sessionHeaders(sessionId), ...(token ? authHeaders(token) : {}) },
        });
    },

    addItem(
        item: Pick<CartItem, "product_id" | "quantity">,
        token?: string,
        sessionId?: string,
    ): Promise<Cart> {
        return request("/cart/items", {
            method: "POST",
            headers: { ...sessionHeaders(sessionId), ...(token ? authHeaders(token) : {}) },
            body: JSON.stringify(item),
        });
    },

    updateItem(
        id: string,
        quantity: number,
        token?: string,
        sessionId?: string,
    ): Promise<Cart> {
        return request(`/cart/items/${id}`, {
            method: "PUT",
            headers: { ...sessionHeaders(sessionId), ...(token ? authHeaders(token) : {}) },
            body: JSON.stringify({ quantity }),
        });
    },

    removeItem(id: string, token?: string, sessionId?: string): Promise<Cart> {
        return request(`/cart/items/${id}`, {
            method: "DELETE",
            headers: { ...sessionHeaders(sessionId), ...(token ? authHeaders(token) : {}) },
        });
    },
};

// ── User (authenticated) ─────────────────────────────────────────────────────

export const userApi = {
    getProfile(token: string): Promise<User> {
        return request("/auth/me", {
            headers: authHeaders(token),
        });
    },

    updateProfile(token: string, payload: UpdateProfilePayload): Promise<User> {
        return request("/auth/me", {
            method: "PUT",
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        });
    },
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersApi = {
    getMyOrders(token: string, page = 1, perPage = 10): Promise<OrderListResponse> {
        return request(`/orders/mine?page=${page}&per_page=${perPage}`, {
            headers: authHeaders(token),
        });
    },

    placeOrder(token: string | undefined, payload: PlaceOrderPayload): Promise<Order> {
        return request("/orders", {
            method: "POST",
            headers: token ? authHeaders(token) : {},
            body: JSON.stringify(payload),
        });
    },
};
