import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import { cartApi } from "@/lib/api";

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    subtotal: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

            addItem: (incoming) => {
                const items = get().items;
                const existing = items.find(
                    (i) => i.product_id === incoming.product_id
                );
                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.product_id === incoming.product_id
                                ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
                                : i
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                ...incoming,
                                id: incoming.id ?? crypto.randomUUID(),
                                quantity: incoming.quantity ?? 1,
                            },
                        ],
                    });
                }
            },

            removeItem: (id) =>
                set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set((s) => ({
                    items: s.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            subtotal: () =>
                get().items.reduce(
                    (sum, i) => sum + i.price_inr * i.quantity,
                    0
                ),

            itemCount: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: "devbhoomi-cart",
            partialize: (state) => ({ items: state.items }),
        }
    )
);
