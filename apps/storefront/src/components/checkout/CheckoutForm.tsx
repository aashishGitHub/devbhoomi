"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { userApi, ordersApi } from "@/lib/api";
import type { User } from "@/types/user";
import type { Order } from "@/types/order";
import {
  MapPin,
  Truck,
  Smartphone,
  MessageCircle,
  CheckCircle,
  Copy,
  Pencil,
  Home,
  Phone,
  Loader2,
} from "lucide-react";

const addressSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
  line1: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  country: z.literal("IN").default("IN"),
});

type AddressValues = z.infer<typeof addressSchema>;

type Step = "Address" | "Shipping" | "Payment";

const STEPS: Step[] = ["Address", "Shipping", "Payment"];

export function CheckoutForm() {
  const [step, setStep] = useState<Step>("Address");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const { items, subtotal, clearCart } = useCartStore();
  const { user, tokens, isAuthenticated } = useAuthStore();

  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? "devtatva@paytm";
  const WHATSAPP_NUMBER =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddressValues>({ resolver: zodResolver(addressSchema) });

  const token = tokens?.access_token ?? undefined;

  const hasSavedAddress = (p: User | null) =>
    !!(
      p?.address_line1 &&
      p?.address_city &&
      p?.address_state &&
      p?.address_pincode &&
      p?.phone
    );

  // Fetch profile on mount, auto-advance to Shipping if address is complete
  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated || !token) return;
      try {
        const p = await userApi.getProfile(token);
        setProfile(p);
        if (hasSavedAddress(p)) {
          reset({
            name: p.name ?? "",
            phone: p.phone ?? "",
            line1: p.address_line1 ?? "",
            city: p.address_city ?? "",
            state: p.address_state ?? "",
            pincode: p.address_pincode ?? "",
            country: "IN" as const,
          });
          setStep("Shipping");
        }
      } catch {
        // non-fatal
      }
    }
    loadProfile();
  }, [isAuthenticated, token, reset]);

  const total = subtotal();
  const shipping = total >= 999 ? 0 : 99;

  function onAddressSubmit() {
    setEditingAddress(false);
    setStep("Shipping");
  }

  // Build shipping_address from form values (saved profile or manual entry)
  function getShippingAddress() {
    const vals = getValues();
    // If user has saved address and isn't editing, use profile directly
    if (hasSavedAddress(profile) && !editingAddress) {
      return {
        name: profile!.name,
        line1: profile!.address_line1 ?? "",
        line2: profile!.address_line2 ?? "",
        city: profile!.address_city ?? "",
        state: profile!.address_state ?? "",
        pincode: profile!.address_pincode ?? "",
        phone: profile!.phone ?? "",
      };
    }
    return {
      name: vals.name,
      line1: vals.line1,
      line2: "",
      city: vals.city,
      state: vals.state,
      pincode: vals.pincode,
      phone: vals.phone,
    };
  }

  // Place order via API
  async function handlePlaceOrder() {
    setOrderError("");
    setPlacingOrder(true);
    try {
      const shippingAddress = getShippingAddress();
      const orderItems = items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        slug: i.slug,
        image: i.image,
        price_inr: i.price_inr,
        quantity: i.quantity,
      }));

      const order = await ordersApi.placeOrder(token, {
        shipping_address: shippingAddress,
        payment_method: "upi",
        items: orderItems,
      });

      setPlacedOrder(order);
      clearCart();
      setOrderConfirmed(true);
    } catch (err: any) {
      setOrderError(err.message ?? "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        {/* Step progress */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-0">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= stepIdx
                      ? "bg-forest text-snow"
                      : "bg-muted/20 text-muted"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    i <= stepIdx ? "text-forest" : "text-muted"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 w-12 ${
                    i < stepIdx ? "bg-forest" : "bg-muted/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Address step ─────────────────────────────────────────────── */}
        {step === "Address" && (
          <>
            {hasSavedAddress(profile) && !editingAddress ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-forest/10 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-forest font-semibold text-sm">
                      <Home className="w-4 h-4 text-rust" />
                      Delivery Address
                    </div>
                    <button
                      onClick={() => {
                        reset({
                          name: profile!.name ?? "",
                          phone: profile!.phone ?? "",
                          line1: profile!.address_line1 ?? "",
                          city: profile!.address_city ?? "",
                          state: profile!.address_state ?? "",
                          pincode: profile!.address_pincode ?? "",
                          country: "IN" as const,
                        });
                        setEditingAddress(true);
                      }}
                      className="flex items-center gap-1 text-xs font-medium text-rust hover:text-rust/80 transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Change
                    </button>
                  </div>
                  <div className="text-sm text-forest space-y-0.5">
                    <p className="font-medium">{profile!.name}</p>
                    <p className="flex items-center gap-1.5 text-forest/60">
                      <Phone className="w-3 h-3" /> {profile!.phone}
                    </p>
                    <p>{profile!.address_line1}</p>
                    {profile!.address_line2 && <p>{profile!.address_line2}</p>}
                    <p>
                      {profile!.address_city}, {profile!.address_state}{" "}
                      {profile!.address_pincode}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setStep("Shipping")}
                  >
                    Ship to this address →
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setEditingAddress(true)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit address
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onAddressSubmit)}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-6 text-forest font-semibold">
                  <MapPin className="w-5 h-5 text-rust" aria-hidden="true" />
                  {editingAddress
                    ? "Edit Delivery Address"
                    : "Delivery Address"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full name"
                    required
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    required
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>
                <Input
                  label="Address line 1"
                  required
                  error={errors.line1?.message}
                  {...register("line1")}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    required
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <Input
                    label="State"
                    required
                    error={errors.state?.message}
                    {...register("state")}
                  />
                  <Input
                    label="Pincode"
                    required
                    error={errors.pincode?.message}
                    {...register("pincode")}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting}
                  >
                    Continue to Shipping
                  </Button>
                  {editingAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setEditingAddress(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </>
        )}

        {/* ── Shipping step ──────────────────────────────────────────────── */}
        {step === "Shipping" && (
          <div className="space-y-5">
            {hasSavedAddress(profile) && (
              <div className="rounded-xl border border-forest/10 p-4 bg-forest/[0.02]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-1">
                    Delivering to
                  </p>
                  <button
                    onClick={() => {
                      setStep("Address");
                      setEditingAddress(true);
                    }}
                    className="text-xs font-medium text-rust hover:text-rust/80 transition-colors"
                  >
                    Change
                  </button>
                </div>
                <p className="text-sm font-medium text-forest">
                  {profile!.name}
                </p>
                <p className="text-xs text-forest/60">
                  {profile!.address_line1},{" "}
                  {profile!.address_city}, {profile!.address_state}{" "}
                  {profile!.address_pincode}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-forest font-semibold">
              <Truck className="w-5 h-5 text-rust" aria-hidden="true" />
              Shipping Method
            </div>
            <div className="space-y-3 mb-6">
              {[
                {
                  label: "Standard Delivery",
                  eta: "4–6 business days",
                  price: total >= 999 ? 0 : 99,
                },
                {
                  label: "Express Delivery",
                  eta: "2–3 business days",
                  price: 199,
                },
              ].map(({ label, eta, price }) => (
                <label
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-muted/30 cursor-pointer hover:border-forest transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest/5"
                >
                  <input
                    type="radio"
                    name="shipping"
                    defaultChecked={label.includes("Standard")}
                    className="accent-forest"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-forest">
                      {label}
                    </div>
                    <div className="text-xs text-forest/50">{eta}</div>
                  </div>
                  <span className="text-sm font-bold text-forest">
                    {price === 0 ? "Free" : formatINR(price)}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("Address")}>
                ← Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setStep("Payment")}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {/* ── Payment step ──────────────────────────────────────────────── */}
        {step === "Payment" && !orderConfirmed && (
          <div>
            <div className="flex items-center gap-2 mb-6 text-forest font-semibold">
              <Smartphone
                className="w-5 h-5 text-rust"
                aria-hidden="true"
              />
              Complete Payment
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-5">
              <p className="font-semibold mb-0.5">Demo Payment Mode</p>
              <p className="text-xs">
                Pay via UPI or message us on WhatsApp with your order details.
                Your order will be confirmed within 2 hours of payment.
              </p>
            </div>

            <div className="bg-cream rounded-2xl p-6 text-center mb-5 border border-muted/20">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Amount to Pay
              </p>
              <p className="text-4xl font-bold text-forest mb-1">
                {formatINR(total + shipping)}
              </p>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 border border-muted/30 mt-2">
                <span className="text-xs text-gray-500">UPI ID:</span>
                <span className="text-xs font-mono font-semibold text-forest">
                  {UPI_ID}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(UPI_ID);
                    setCopiedUpi(true);
                    setTimeout(() => setCopiedUpi(false), 2000);
                  }}
                  className="text-gray-400 hover:text-forest transition-colors"
                  aria-label="Copy UPI ID"
                >
                  {copiedUpi ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <a
                href={`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=Devtatva+Heritage&am=${total + shipping}&cu=INR&tn=Devtatva+Order`}
                className="flex items-center justify-center gap-2.5 bg-forest text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-forest/90 transition-colors"
              >
                <Smartphone className="h-4 w-4" />
                Pay via UPI App
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi! I want to place an order on Devtatva.\n\nOrder total: ${formatINR(total + shipping)}\nItems: ${items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}\n\nPlease guide me on payment confirmation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#25D366]/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </a>
            </div>

            {/* Confirm — saves order to DB */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full border-2 border-forest text-forest rounded-xl py-3 text-sm font-semibold hover:bg-forest/5 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {placingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing order…
                </>
              ) : (
                "✓ I've completed the payment"
              )}
            </button>

            {orderError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {orderError}
              </p>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("Shipping")}
            >
              ← Back
            </Button>
          </div>
        )}

        {/* Order confirmed state */}
        {step === "Payment" && orderConfirmed && (
          <div className="text-center py-10">
            <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-forest font-display mb-2">
              Order Received!
            </h2>
            {placedOrder && (
              <p className="text-sm text-forest/60 mb-1">
                Order #{placedOrder.id.slice(0, 8).toUpperCase()}
              </p>
            )}
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Thank you for your order. Our team will verify your payment and
              confirm shipment within 2 business hours on WhatsApp.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              {isAuthenticated && (
                <Link
                  href="/account"
                  className="bg-forest text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest/90 transition-colors"
                >
                  View My Orders
                </Link>
              )}
              <Link
                href="/"
                className="border-2 border-forest text-forest px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest/5 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="bg-snow rounded-2xl border border-muted/20 p-5 sticky top-24">
          <h3 className="font-bold text-forest mb-4">
            Order Summary ({items.length} items)
          </h3>
          <div className="space-y-3 text-sm text-forest/70 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="truncate max-w-[160px]">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-forest">
                  {formatINR(item.price_inr * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-muted/20 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-forest/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-forest">
              <span>Total</span>
              <span>{formatINR(total + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
