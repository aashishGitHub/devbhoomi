"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartView() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  if (!items.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center py-16">
        <ShoppingBag className="w-14 h-14 text-muted/40 mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-forest mb-2">Your cart is empty</h2>
        <p className="text-forest/50 text-sm mb-6">
          Discover authentic Himalayan products to add to your collection.
        </p>
        <Button variant="primary" asChild>
          <Link href="/products">
            Explore Products
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    );
  }

  const total = subtotal();
  const freeShippingThreshold = 999;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items */}
      <div className="lg:col-span-2 space-y-4">
        {freeShippingRemaining > 0 && (
          <div className="bg-misty/20 border border-misty/30 rounded-xl px-4 py-3 text-sm text-forest">
            Add{" "}
            <span className="font-semibold">{formatINR(freeShippingRemaining)}</span>{" "}
            more for free shipping!
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-snow rounded-2xl p-4 border border-muted/20"
          >
            {/* Image */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl" aria-hidden="true">
                  🌿
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="text-sm font-semibold text-forest hover:text-stone transition-colors line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="text-base font-bold text-forest mt-1">
                {formatINR(item.price_inr)}
              </p>

              <div className="flex items-center gap-3 mt-3">
                {/* Qty */}
                <div className="flex items-center gap-1.5 border border-muted/30 rounded-lg p-0.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3 text-forest" aria-hidden="true" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-forest">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3 text-forest" aria-hidden="true" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted hover:text-red-500 transition-colors p-1 rounded"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>

                {/* Line total */}
                <span className="ml-auto text-sm font-semibold text-forest">
                  {formatINR(item.price_inr * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="bg-snow rounded-2xl border border-muted/20 p-6 sticky top-24">
          <h2 className="text-lg font-bold text-forest mb-5">Order Summary</h2>

          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between text-forest/70">
              <span>Subtotal</span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="flex justify-between text-forest/70">
              <span>Shipping</span>
              <span className={total >= freeShippingThreshold ? "text-green-600 font-medium" : ""}>
                {total >= freeShippingThreshold ? "Free" : formatINR(99)}
              </span>
            </div>
            <div className="border-t border-muted/20 pt-3 flex justify-between font-bold text-base text-forest">
              <span>Total</span>
              <span>
                {formatINR(total + (total >= freeShippingThreshold ? 0 : 99))}
              </span>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth asChild>
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>

          <p className="text-xs text-center text-forest/40 mt-4">
            Secure payment via Razorpay &amp; Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
