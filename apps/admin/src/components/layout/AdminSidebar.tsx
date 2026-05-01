"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    Building2,
    FileText,
    Mountain,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/products", icon: Package },
    { label: "Orders", href: "/orders", icon: ShoppingCart },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "B2B / Wholesale", href: "/b2b", icon: Building2 },
    { label: "Compliance", href: "/compliance", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-56 flex-shrink-0 bg-sidebar text-white flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
                <Mountain className="h-6 w-6 text-misty" />
                <span className="font-bold text-sm font-display text-misty">
                    Devtatva
                </span>
                <span className="text-xs text-white/40 ml-auto">Admin</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
                <ul className="space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                        const active =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                                        active
                                            ? "bg-forest text-white font-medium"
                                            : "text-white/60 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 flex-shrink-0" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="px-2 py-4 border-t border-white/10">
                <button
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => {
                        document.cookie = "admin_token=; path=/; max-age=0";
                        sessionStorage.removeItem("admin_token");
                        window.location.href = "/login";
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
