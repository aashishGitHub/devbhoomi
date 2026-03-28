"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const FREE_SHIPPING_THRESHOLD = 999;

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } =
        useCartStore();
    const overlayRef = useRef<HTMLDivElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeCart();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, closeCart]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const total = subtotal();
    const shippingGap = FREE_SHIPPING_THRESHOLD - total;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer panel */}
            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
                className="relative flex flex-col w-full max-w-md bg-snow shadow-2xl h-full"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-muted/30">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-forest" />
                        <span className="font-semibold text-forest font-display">
                            Your Cart
                        </span>
                        {itemCount() > 0 && (
                            <span className="bg-rust text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {itemCount()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Free shipping progress */}
                {items.length > 0 && (
                    <div className="px-5 py-3 bg-cream/60 border-b border-muted/20">
                        {shippingGap > 0 ? (
                            <p className="text-xs text-stone">
                                Add{" "}
                                <span className="font-semibold text-rust">
                                    {formatINR(shippingGap)}
                                </span>{" "}
                                more for free shipping
                            </p>
                        ) : (
                            <p className="text-xs text-forest font-semibold">
                                🎉 You&apos;ve unlocked free shipping!
                            </p>
                        )}
                        <div className="mt-1.5 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-forest rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        (total / FREE_SHIPPING_THRESHOLD) * 100,
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
                            <ShoppingBag className="h-14 w-14 text-muted" />
                            <p className="text-gray-500 text-sm">Your cart is empty</p>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={closeCart}
                                asChild
                            >
                                <Link href="/products">Browse Products</Link>
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 bg-white rounded-xl p-3 shadow-sm border border-muted/20"
                            >
                                {/* Image */}
                                <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-2xl">
                                            🌿
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-forest truncate">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatINR(item.price_inr)} each
                                    </p>

                                    <div className="flex items-center justify-between mt-2">
                                        {/* Qty controls */}
                                        <div className="flex items-center gap-1 bg-cream rounded-lg">
                                            <button
                                                className="p-1 text-forest hover:text-rust transition-colors disabled:opacity-30"
                                                onClick={() =>
                                                    item.quantity > 1
                                                        ? updateQuantity(item.id, item.quantity - 1)
                                                        : removeItem(item.id)
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="text-sm font-semibold text-forest w-6 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="p-1 text-forest hover:text-rust transition-colors disabled:opacity-30"
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                disabled={item.quantity >= 99}
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-forest">
                                                {formatINR(item.price_inr * item.quantity)}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-muted/30 px-5 py-4 bg-white space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal ({itemCount()} items)</span>
                            <span className="font-semibold text-forest">{formatINR(total)}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                            Shipping and taxes calculated at checkout
                        </p>
                        <Button variant="primary" className="w-full" asChild onClick={closeCart}>
                            <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                        <button
                            onClick={closeCart}
                            className="w-full text-sm text-center text-stone hover:text-forest transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
