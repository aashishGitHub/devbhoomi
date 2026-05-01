"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi, type Order } from "@/lib/api";
import { formatINR, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-indigo-100 text-indigo-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
    refunded: "bg-gray-100 text-gray-600",
};

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await adminApi.listOrders(page);
            setOrders(resp.items);
            setTotal(resp.total);
            setTotalPages(resp.total_pages);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await adminApi.updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch {
            alert("Failed to update order status");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Orders</h1>
                <p className="text-sm text-gray-500 mt-0.5">View and manage all customer orders ({total} total)</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <div className="admin-card overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="table-th">Order ID</th>
                            <th className="table-th">Items</th>
                            <th className="table-th">Total</th>
                            <th className="table-th">Payment</th>
                            <th className="table-th">Status</th>
                            <th className="table-th">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="table-td text-center py-12">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="table-td text-center text-gray-400 py-12 text-sm">
                                    No orders yet.
                                </td>
                            </tr>
                        ) : (
                            orders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50/60">
                                    <td className="table-td font-mono text-xs">{o.id.slice(0, 8)}...</td>
                                    <td className="table-td text-sm">{o.items?.length ?? 0} items</td>
                                    <td className="table-td font-semibold text-sm">{formatINR(o.total_inr)}</td>
                                    <td className="table-td">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {o.payment_status}
                                        </span>
                                    </td>
                                    <td className="table-td">
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                            className={`text-xs px-2 py-1 rounded-lg border-0 font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100"}`}
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="table-td text-xs text-gray-400">{formatDate(o.created_at)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
                        <span>Page {page} of {totalPages}</span>
                        <div className="flex gap-1">
                            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
