import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Orders</h1>
                <p className="text-sm text-gray-500 mt-0.5">View and manage all customer orders</p>
            </div>
            <div className="admin-card p-12 text-center text-gray-400 text-sm">
                Order management — connect backend API to populate.
            </div>
        </div>
    );
}
