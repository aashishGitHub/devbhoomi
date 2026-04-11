import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-forest">Devtatva</span>
            <span className="block text-xs text-muted tracking-widest uppercase mt-0.5">
              From the Land of Gods to Your Home
            </span>
          </Link>
        </div>

        <div className="bg-snow rounded-2xl shadow-card p-8">
          <h1 className="text-2xl font-bold text-forest mb-1">
            Create your account
          </h1>
          <p className="text-forest/60 text-sm mb-8">
            Join thousands who trust Devtatva for authentic Himalayan products
          </p>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-forest/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-forest font-semibold hover:text-stone transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
