import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="section py-8">
      <h1 className="text-2xl font-bold text-forest mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
