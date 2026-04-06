import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import { cartApi } from "@/lib/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

interface CartStore {
  items: CartItem[];
  sessionId: string;
  isOpen: boolean;
  isSyncing: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Sync cart from backend on mount / after login
  syncCart: (token?: string) => Promise<void>;

  // Merge guest session cart into user cart after login
  mergeCartOnLogin: (token: string) => Promise<void>;

  addItem: (item: Omit<CartItem, "id"> & { id?: string }, token?: string) => Promise<void>;
  removeItem: (id: string, token?: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, token?: string) => Promise<void>;
  clearCart: () => void;

  subtotal: () => number;
  itemCount: () => number;
}

function generateSessionId(): string {
  return crypto.randomUUID();
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: generateSessionId(),
      isOpen: false,
      isSyncing: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      syncCart: async (token?: string) => {
        if (USE_MOCK) return;
        try {
          set({ isSyncing: true });
          const cart = await cartApi.get(token, get().sessionId);
          set({ items: cart.items });
        } catch {
          // silent — use local state as fallback
        } finally {
          set({ isSyncing: false });
        }
      },

      mergeCartOnLogin: async (token: string) => {
        if (USE_MOCK) return;
        const sessionId = get().sessionId;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/v1/cart/merge`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ session_id: sessionId }),
            }
          );
          if (res.ok) {
            const cart = await res.json();
            set({ items: cart.items, sessionId: generateSessionId() });
          }
        } catch {
          // non-fatal — continue with local state
        }
      },

      addItem: async (incoming, token?: string) => {
        if (USE_MOCK) {
          localAddItem(set, get, incoming);
          return;
        }
        try {
          const cart = await cartApi.addItem(
            { product_id: incoming.product_id, quantity: incoming.quantity ?? 1 },
            token,
            get().sessionId
          );
          set({ items: cart.items });
        } catch {
          // Optimistic fallback
          localAddItem(set, get, incoming);
        }
      },

      removeItem: async (id: string, token?: string) => {
        if (USE_MOCK) {
          set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
          return;
        }
        try {
          const cart = await cartApi.removeItem(id, token, get().sessionId);
          set({ items: cart.items });
        } catch {
          set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
        }
      },

      updateQuantity: async (id: string, quantity: number, token?: string) => {
        if (quantity <= 0) {
          get().removeItem(id, token);
          return;
        }
        if (USE_MOCK) {
          set((s) => ({
            items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          }));
          return;
        }
        try {
          const cart = await cartApi.updateItem(id, quantity, token, get().sessionId);
          set({ items: cart.items });
        } catch {
          set((s) => ({
            items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price_inr * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "devbhoomi-cart",
      partialize: (state) => ({ items: state.items, sessionId: state.sessionId }),
    }
  )
);

// ── local-only mutation (mock mode + optimistic fallback) ─────────────────────

function localAddItem(
  set: (fn: (s: CartStore) => Partial<CartStore>) => void,
  get: () => CartStore,
  incoming: Omit<CartItem, "id"> & { id?: string }
) {
  const items = get().items;
  const existing = items.find((i) => i.product_id === incoming.product_id);
  if (existing) {
    set((s) => ({
      items: s.items.map((i) =>
        i.product_id === incoming.product_id
          ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
          : i
      ),
    }));
  } else {
    set((s) => ({
      items: [
        ...s.items,
        {
          ...incoming,
          id: incoming.id ?? crypto.randomUUID(),
          quantity: incoming.quantity ?? 1,
        },
      ],
    }));
  }
}
