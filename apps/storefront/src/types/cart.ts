export interface CartItem {
    id: string;
    product_id: string;
    name: string;
    slug: string;
    image: string;
    price_inr: number;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    subtotal_inr: number;
    item_count: number;
}
