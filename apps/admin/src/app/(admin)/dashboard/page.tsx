"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    ShoppingCart,
    Users,
    Package,
    AlertTriangle,
    Clock,
    Loader2,
} from "lucide-react";
import { adminApi, type DashboardStats } from "@/lib/api";
import { formatINR } from "@/lib/utils";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        adminApi
            .getDashboardStats()
            .then(setStats)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const STATS = [
        {
            label: "Total Revenue",
            value: stats ? formatINR(stats.total_revenue) : "--",
            icon: TrendingUp,
            color: "text-forest",
            bg: "bg-forest/10",
        },
        {
            label: "Total Orders",
            value: stats ? String(stats.total_orders) : "--",
            icon: ShoppingCart,
            color: "text-stone",
            bg: "bg-stone/10",
        },
        {
            label: "Total Customers",
            value: stats ? String(stats.total_customers) : "--",
            icon: Users,
            color: "text-rust",
            bg: "bg-rust/10",
        },
        {
            label: "Low Stock Items",
            value: stats ? String(stats.low_stock_count) : "--",
            positive: false,
            icon: Package,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    Welcome back — here&apos;s what&apos;s happening today.
                </p>
            </div>

            {/* Alert banner */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>
                    Check <a href="/b2b" className="underline font-medium hover:text-amber-900">B2B accounts</a> for
                    pending wholesale approvals.
                </span>
                <Clock className="h-4 w-4 ml-auto text-amber-500 flex-shrink-0" />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                    <div key={stat.label} className="stat-card flex items-start gap-4">
                        <div className={`p-2.5 rounded-lg ${stat.bg} flex-shrink-0`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin text-gray-300" /> : stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <a href="/products" className="admin-card p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="h-5 w-5 text-forest" />
                        <h3 className="font-semibold text-gray-800 group-hover:text-forest transition-colors">Manage Products</h3>
                    </div>
                    <p className="text-sm text-gray-500">Add, edit, and manage product inventory</p>
                </a>
                <a href="/orders" className="admin-card p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2">
                        <ShoppingCart className="h-5 w-5 text-stone" />
                        <h3 className="font-semibold text-gray-800 group-hover:text-forest transition-colors">View Orders</h3>
                    </div>
                    <p className="text-sm text-gray-500">Track and manage customer orders</p>
                </a>
                <a href="/customers" className="admin-card p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-rust" />
                        <h3 className="font-semibold text-gray-800 group-hover:text-forest transition-colors">Customers</h3>
                    </div>
                    <p className="text-sm text-gray-500">View registered customers and wholesalers</p>
                </a>
            </div>
        </div>
    );
}
