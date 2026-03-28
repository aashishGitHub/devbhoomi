import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format Indian Rupee price */
export function formatINR(amount: number, decimals = 0): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);
}

/** Format USD price */
export function formatUSD(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

/** Truncate text to n characters */
export function truncate(text: string, n: number): string {
    return text.length > n ? text.slice(0, n).trimEnd() + "…" : text;
}

/** Slugify a string */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
}

/** Calculate B2B discount for a given quantity */
export function getB2BDiscount(
    qty: number,
    tiers: Array<{ min_qty: number; max_qty?: number; discount_pct: number }>
): number {
    const tier = tiers
        .slice()
        .reverse()
        .find((t) => qty >= t.min_qty);
    return tier?.discount_pct ?? 0;
}
