"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Package,
  LogOut,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Pencil,
  Check,
  X,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { userApi, ordersApi } from "@/lib/api";
import { clearAuthCookie } from "@/lib/jwt";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Order, OrderListResponse } from "@/types/order";
import type { User as UserType, UpdateProfilePayload } from "@/types/user";
import { cn } from "@/lib/utils";

// ── Schemas ───────────────────────────────────────────────────────────────────

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile").or(z.literal(""));

const addressSchema = z.object({
  address_line1: z.string().min(5, "Address is too short"),
  address_line2: z.string().optional().default(""),
  address_city: z.string().min(2, "City required"),
  address_state: z.string().min(2, "State required"),
  address_pincode: z.string().regex(/^\d{6}$/, "6-digit pincode required"),
});

type AddressForm = z.infer<typeof addressSchema>;

// ── Status labels ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", color: "bg-indigo-100 text-indigo-800" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const router = useRouter();
  const { user, tokens, isAuthenticated, clearAuth, setAuth } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);

  // Profile state (fetched fresh from API, includes address)
  const [profile, setProfile] = useState<UserType | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Edit modes
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [reordering, setReordering] = useState<string | null>(null);

  const token = tokens?.access_token ?? "";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isAuthenticated, router]);

  // Fetch profile from API
  const fetchProfile = useCallback(() => {
    if (!token) return;
    setProfileLoading(true);
    userApi
      .getProfile(token)
      .then((p) => {
        setProfile(p);
        setPhoneValue(p.phone ?? "");
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fetch orders
  useEffect(() => {
    if (!token) return;
    setOrdersLoading(true);
    ordersApi
      .getMyOrders(token, page, 5)
      .then((res: OrderListResponse) => {
        setOrders(res.items);
        setOrdersTotal(res.total);
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [token, page]);

  if (!isAuthenticated || !user) return null;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleLogout = () => {
    clearAuth();
    clearAuthCookie();
    router.push("/login");
  };

  const handleSavePhone = async () => {
    const result = phoneSchema.safeParse(phoneValue);
    if (!result.success) {
      setPhoneError(result.error.errors[0].message);
      return;
    }
    setPhoneError("");
    setSavingPhone(true);
    try {
      const updated = await userApi.updateProfile(token, { phone: phoneValue });
      setProfile(updated);
      // Update zustand store so header reflects new name/phone
      setAuth(
        { ...user, phone: updated.phone },
        tokens!
      );
      setEditingPhone(false);
    } catch {
      setPhoneError("Failed to update phone");
    } finally {
      setSavingPhone(false);
    }
  };

  const handleReorder = async (order: Order) => {
    setReordering(order.id);
    try {
      for (const item of order.items) {
        await addItem(
          {
            product_id: item.product_id,
            name: item.name,
            slug: item.slug,
            image: item.image,
            price_inr: item.price_inr,
            quantity: item.quantity,
          },
          token
        );
      }
      useCartStore.getState().openCart();
    } catch {} finally {
      setReordering(null);
    }
  };

  const hasAddress = (p: UserType | null) =>
    !!(p?.address_line1 && p?.address_city && p?.address_state && p?.address_pincode);

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="section max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-forest mb-8">
          My Account
        </h1>

        {/* ── Profile card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-forest/10 shadow-sm overflow-hidden mb-8">
          {/* Header row */}
          <div className="p-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-forest text-snow flex items-center justify-center text-lg font-bold shrink-0">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-forest">
                  {user.name}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-forest/60 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {memberSince}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-rust hover:text-rust/80 font-medium px-3 py-1.5 rounded-lg hover:bg-rust/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {profileLoading ? (
            <div className="px-6 pb-6 space-y-3 animate-pulse">
              <div className="h-4 bg-forest/10 rounded w-1/3" />
              <div className="h-4 bg-forest/10 rounded w-1/2" />
            </div>
          ) : (
            <div className="border-t border-forest/5 divide-y divide-forest/5">
              {/* Email — read-only */}
              <div className="px-6 py-4 flex items-center gap-3">
                <Mail className="w-4 h-4 text-forest/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forest/40 mb-0.5">Email address</p>
                  <p className="text-sm font-medium text-forest truncate">
                    {profile?.email ?? user.email}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-forest/30 bg-forest/5 px-2 py-0.5 rounded font-semibold">
                  Read only
                </span>
              </div>

              {/* Role badge */}
              <div className="px-6 py-4 flex items-center gap-3">
                <Shield className="w-4 h-4 text-forest/40 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-forest/40 mb-0.5">Account type</p>
                  <p className="text-sm font-medium text-forest capitalize">
                    {profile?.role ?? user.role}
                  </p>
                </div>
              </div>

              {/* Phone — editable inline */}
              <div className="px-6 py-4 flex items-start gap-3">
                <Phone className="w-4 h-4 text-forest/40 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forest/40 mb-0.5">Phone number</p>
                  {editingPhone ? (
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="tel"
                          value={phoneValue}
                          onChange={(e) => {
                            setPhoneValue(e.target.value);
                            setPhoneError("");
                          }}
                          placeholder="e.g. 9876543210"
                          className={cn(
                            "w-full rounded-lg border bg-snow px-3 py-2 text-sm text-forest placeholder:text-forest/30",
                            "focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent",
                            phoneError ? "border-red-400" : "border-forest/20"
                          )}
                          maxLength={10}
                        />
                        {phoneError && (
                          <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                        )}
                      </div>
                      <button
                        onClick={handleSavePhone}
                        disabled={savingPhone}
                        className="p-2 rounded-lg bg-forest text-snow hover:bg-forest/90 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPhone(false);
                          setPhoneValue(profile?.phone ?? "");
                          setPhoneError("");
                        }}
                        className="p-2 rounded-lg border border-forest/20 text-forest/50 hover:bg-forest/5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-forest">
                        {profile?.phone || (
                          <span className="text-forest/30 italic">Not set</span>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          setPhoneValue(profile?.phone ?? "");
                          setEditingPhone(true);
                        }}
                        className="p-1 rounded-md text-forest/40 hover:text-forest hover:bg-forest/5 transition-colors"
                        aria-label="Edit phone"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Address — editable section */}
              <div className="px-6 py-4 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-forest/40 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forest/40 mb-0.5">Default delivery address</p>
                  {editingAddress ? (
                    <AddressEditForm
                      profile={profile}
                      token={token}
                      onSave={async (payload) => {
                        setSavingAddress(true);
                        setAddressError("");
                        try {
                          const updated = await userApi.updateProfile(token, payload);
                          setProfile(updated);
                          setAuth({ ...user, ...updated }, tokens!);
                          setEditingAddress(false);
                        } catch {
                          setAddressError("Failed to save address");
                        } finally {
                          setSavingAddress(false);
                        }
                      }}
                      onCancel={() => {
                        setEditingAddress(false);
                        setAddressError("");
                      }}
                      saving={savingAddress}
                      error={addressError}
                    />
                  ) : (
                    <div>
                      {hasAddress(profile) ? (
                        <div className="flex items-start gap-2">
                          <div className="text-sm text-forest">
                            <p className="font-medium">{profile!.address_line1}</p>
                            {profile!.address_line2 && (
                              <p>{profile!.address_line2}</p>
                            )}
                            <p>
                              {profile!.address_city}, {profile!.address_state}{" "}
                              {profile!.address_pincode}
                            </p>
                          </div>
                          <button
                            onClick={() => setEditingAddress(true)}
                            className="p-1 rounded-md text-forest/40 hover:text-forest hover:bg-forest/5 transition-colors shrink-0"
                            aria-label="Edit address"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-forest/30 italic">
                            No address saved
                          </p>
                          <button
                            onClick={() => setEditingAddress(true)}
                            className="text-xs font-medium text-rust hover:text-rust/80 transition-colors"
                          >
                            + Add address
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Orders section ──────────────────────────────────────────────── */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-forest flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order History
          </h2>
          {ordersTotal > 0 && (
            <span className="text-sm text-forest/50">
              {ordersTotal} order{ordersTotal !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {ordersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-forest/10 p-5 animate-pulse"
              >
                <div className="h-4 bg-forest/10 rounded w-1/3 mb-3" />
                <div className="h-3 bg-forest/10 rounded w-1/2 mb-2" />
                <div className="h-3 bg-forest/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-forest/10 p-8 text-center">
            <Package className="w-12 h-12 text-forest/20 mx-auto mb-3" />
            <p className="text-forest/50 font-medium">No orders yet</p>
            <p className="text-sm text-forest/40 mt-1">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rust hover:text-rust/80"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? {
                label: order.status,
                color: "bg-gray-100 text-gray-800",
              };
              const date = new Date(order.created_at).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "short", year: "numeric" }
              );
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-forest/10 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-3 bg-forest/[0.02] border-b border-forest/5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-forest/50">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          status.color
                        )}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs text-forest/40">{date}</span>
                    </div>
                    <span className="text-sm font-semibold text-forest">
                      ₹{order.total_inr.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="px-5 py-3">
                    <div className="divide-y divide-forest/5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
                        >
                          {item.image && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-forest/5 shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-forest truncate">
                              {item.name}
                              {item.variant_name && (
                                <span className="text-forest/50">
                                  {" "}
                                  — {item.variant_name}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-forest/40">
                              Qty: {item.quantity} × ₹
                              {item.price_inr.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <span className="text-sm text-forest/70 font-medium">
                            ₹
                            {(item.price_inr * item.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.shipping_address && (
                      <div className="mt-2 pt-2 border-t border-forest/5 flex items-start gap-1.5 text-xs text-forest/40">
                        <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.state}{" "}
                          {order.shipping_address.pincode}
                        </span>
                      </div>
                    )}

                    {order.status !== "cancelled" &&
                      order.status !== "refunded" && (
                        <div className="mt-3 pt-2 border-t border-forest/5 flex justify-end">
                          <button
                            onClick={() => handleReorder(order)}
                            disabled={reordering === order.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                              reordering === order.id
                                ? "text-forest/40 bg-forest/5"
                                : "text-rust hover:bg-rust/5"
                            )}
                          >
                            <RefreshCw
                              className={cn(
                                "w-3.5 h-3.5",
                                reordering === order.id && "animate-spin"
                              )}
                            />
                            {reordering === order.id
                              ? "Adding to cart..."
                              : "Reorder"}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}

            {ordersTotal > 5 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-forest/10 text-forest/60 hover:bg-forest/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-forest/50">
                  Page {page} of {Math.ceil(ordersTotal / 5)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(ordersTotal / 5)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-forest/10 text-forest/60 hover:bg-forest/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Address edit sub-component ────────────────────────────────────────────────

function AddressEditForm({
  profile,
  token,
  onSave,
  onCancel,
  saving,
  error,
}: {
  profile: UserType | null;
  token: string;
  onSave: (payload: UpdateProfilePayload) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  error: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line1: profile?.address_line1 ?? "",
      address_line2: profile?.address_line2 ?? "",
      address_city: profile?.address_city ?? "",
      address_state: profile?.address_state ?? "",
      address_pincode: profile?.address_pincode ?? "",
    },
  });

  const submit = async (data: AddressForm) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3 mt-1">
      <Input
        label="Address line 1"
        required
        error={errors.address_line1?.message}
        {...register("address_line1")}
      />
      <Input
        label="Address line 2"
        error={errors.address_line2?.message}
        {...register("address_line2")}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Input
          label="City"
          required
          error={errors.address_city?.message}
          {...register("address_city")}
        />
        <Input
          label="State"
          required
          error={errors.address_state?.message}
          {...register("address_state")}
        />
        <Input
          label="Pincode"
          required
          error={errors.address_pincode?.message}
          {...register("address_pincode")}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" variant="primary" size="sm" loading={saving}>
          Save Address
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
