import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens } from "@/types/user";

interface AuthStore {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    setAuth: (user: User, tokens: AuthTokens) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            tokens: null,
            isAuthenticated: false,

            setAuth: (user, tokens) =>
                set({ user, tokens, isAuthenticated: true }),

            clearAuth: () =>
                set({ user: null, tokens: null, isAuthenticated: false }),
        }),
        {
            name: "devbhoomi-auth",
            partialize: (state) => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
