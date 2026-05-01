"use client";

import { useAuthStore } from "@/store/authStore";
import { clearAuthCookie } from "@/lib/jwt";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LogoutButton() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    clearAuth();
    clearAuthCookie();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6",
        "flex items-center gap-2 bg-forest text-snow px-4 py-2 rounded-xl text-sm font-medium shadow-lg",
        "hover:bg-forest/90 transition-colors"
      )}
      aria-label="Sign out"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:inline">Sign Out</span>
    </button>
  );
}