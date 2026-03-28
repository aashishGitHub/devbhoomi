"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mountain } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginValues) => {
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/v1/admin/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body?.message ?? "Invalid credentials");
            }
            const { token } = await res.json();
            // Store token in httpOnly cookie via a route handler (or localStorage for now)
            sessionStorage.setItem("admin_token", token);
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sidebar via-forest to-stone p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
                {/* Logo */}
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="bg-forest/10 p-3 rounded-full">
                        <Mountain className="h-8 w-8 text-forest" />
                    </div>
                    <h1 className="text-xl font-bold text-forest font-display">
                        Devbhoomi Admin
                    </h1>
                    <p className="text-xs text-gray-400">Sign in to your dashboard</p>
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            {...register("email")}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
                            placeholder="admin@devbhoomi.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                {...register("password")}
                                className="w-full px-3 py-2 pr-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-forest text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
