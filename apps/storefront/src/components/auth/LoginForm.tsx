"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { decodeJWT, setAuthCookie } from "@/lib/jwt";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: LoginValues) {
    try {
      const tokens = await authApi.login(values);
      const payload = decodeJWT(tokens.access_token);
      setAuth(
        {
          id: payload?.user_id ?? "",
          name: payload?.name ?? "",
          email: payload?.email ?? values.email,
          role: payload?.role ?? "customer",
          created_at: new Date().toISOString(),
        },
        tokens
      );
      setAuthCookie(tokens.access_token, tokens.expires_in);

      const params = new URLSearchParams(window.location.search);
      router.push(params.get("redirect") ?? "/");
    } catch (err: any) {
      setError("root", {
        message: err.message ?? "Invalid email or password",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
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
        Sign In
      </Button>
    </form>
  );
}
