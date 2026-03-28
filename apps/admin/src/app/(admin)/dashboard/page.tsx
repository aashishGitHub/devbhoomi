import type { Metadata } from "next";
import {
    TrendingUp,
    ShoppingCart,
    Users,
    Package,
    AlertTriangle,
    Clock,
} from "lucide-react";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopProductsTable } from "@/components/dashboard/TopProductsTable";
import { RecentOrders } from "@/components/dashboard/RecentOrders";

export const metadata: Metadata = { title: "Dashboard" };

// In production these would be fetched from the Go API
const STATS = [
    {
        label: "Total Revenue (30d)",
        value: "₹4,82,350",
        change: "+12.4%",
        positive: true,
        icon: TrendingUp,
        color: "text-forest",
        bg: "bg-forest/10",
    },
    {
        label: "Orders (30d)",
        value: "1,248",
        change: "+7.2%",
        positive: true,
        icon: ShoppingCart,
        color: "text-stone",
        bg: "bg-stone/10",
    },
    {
        label: "Active Customers",
        value: "3,841",
        change: "+5.1%",
        positive: true,
        icon: Users,
        color: "text-rust",
        bg: "bg-rust/10",
    },
    {
        label: "Low Stock Items",
        value: "14",
        change: "Needs attention",
        positive: false,
        icon: Package,
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Welcome back — here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Alert banner for pending B2B approvals */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>
                    <strong>3 wholesale accounts</strong> are pending approval.{" "}
                    <a href="/b2b" className="underline font-medium hover:text-amber-900">
                        Review now →
                    </a>
                </span>
                <Clock className="h-4 w-4 ml-auto text-amber-500 flex-shrink-0" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                    <div key={stat.label} className="stat-card flex items-start gap-4">
                        <div className={`p-2.5 rounded-lg ${stat.bg} flex-shrink-0`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                            <p
                                className={`text-xs mt-0.5 font-medium ${
                                    stat.positive ? "text-green-600" : "text-amber-600"
                                }`}
                            >
                                {stat.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 admin-card p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue (Last 30 days)</h2>
                    <RevenueChart />
                </div>
                <div className="admin-card p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Products</h2>
                    <TopProductsTable />
                </div>
            </div>

            {/* Recent orders */}
            <div className="admin-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-700">Recent Orders</h2>
                    <a href="/orders" className="text-xs text-forest hover:underline font-medium">
                        View all →
                    </a>
                </div>
                <RecentOrders />
            </div>
        </div>
    );
}
