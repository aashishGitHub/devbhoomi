"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { decodeJWT, setAuthCookie } from "@/lib/jwt";
import { cn } from "@/lib/utils";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number").optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  account_type: z.enum(["customer", "wholesaler"]),
});

type RegisterValues = z.infer<typeof schema>;

const ACCOUNT_TYPES = [
  {
    value: "customer",
    label: "Personal",
    description: "Shop for personal or family use",
  },
  {
    value: "wholesaler",
    label: "Wholesale",
    description: "Bulk orders for business / temple",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [accountType, setAccountType] = useState<"customer" | "wholesaler">("customer");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { account_type: "customer" },
  });

  function selectType(type: "customer" | "wholesaler") {
    setAccountType(type);
    setValue("account_type", type);
  }

  async function onSubmit(values: RegisterValues) {
    try {
      const tokens = await authApi.register({
        ...values,
        phone: values.phone || undefined,
      });
      const payload = decodeJWT(tokens.access_token);
      setAuth(
        {
          id: payload?.user_id ?? "",
          name: payload?.name ?? values.name,
          email: payload?.email ?? values.email,
          role: payload?.role ?? (values.account_type === "wholesaler" ? "wholesaler" : "customer"),
          created_at: new Date().toISOString(),
        },
        tokens
      );
      setAuthCookie(tokens.access_token, tokens.expires_in);
      router.push("/");
    } catch (err: any) {
      setError("root", {
        message: err.message ?? "Registration failed. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Account type selector */}
      <div>
        <label className="text-sm font-medium text-forest/80 block mb-1.5">
          Account type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ACCOUNT_TYPES.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => selectType(value as "customer" | "wholesaler")}
              className={cn(
                "text-left p-3 rounded-xl border-2 transition-all duration-150",
                accountType === value
                  ? "border-forest bg-forest/5"
                  : "border-muted/30 hover:border-muted"
              )}
            >
              <div className="text-sm font-semibold text-forest">{label}</div>
              <div className="text-xs text-forest/50 mt-0.5">{description}</div>
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Full name"
        type="text"
        autoComplete="name"
        required
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Mobile number"
        type="tel"
        autoComplete="tel"
        placeholder="10-digit number"
        hint="For order updates via SMS"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        hint="Min 8 chars, 1 uppercase, 1 number"
        error={errors.password?.message}
        {...register("password")}
      />

      {errors.root && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isSubmitting}
        className="mt-2"
      >
        Create Account
      </Button>

      <p className="text-xs text-center text-forest/40">
        By creating an account you agree to our{" "}
        <Link href="/returns" className="underline hover:text-forest">
          Return &amp; Refund Policy
        </Link>{" "}
        and{" "}
        <Link href="/shipping" className="underline hover:text-forest">
          Shipping Policy
        </Link>
        .
      </p>
    </form>
  );
}
