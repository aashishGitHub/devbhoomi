export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

export interface OrderItem {
    product_id: string;
    variant_name?: string;
    name: string;
    slug: string;
    image: string;
    price_inr: number;
    quantity: number;
}

export interface ShippingAddress {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
}

export interface Order {
    id: string;
    user_id?: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal_inr: number;
    shipping_inr: number;
    total_inr: number;
    shipping_address?: ShippingAddress;
    payment_method?: string;
    payment_status: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface OrderListResponse {
    items: Order[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface PlaceOrderPayload {
    shipping_address: ShippingAddress;
    payment_method?: string;
    notes?: string;
    items?: OrderItem[];
}
