import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart and proceed to checkout.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="section py-8">
      <h1 className="text-2xl font-bold text-forest mb-8">Your Cart</h1>
      <CartView />
    </div>
  );
}
