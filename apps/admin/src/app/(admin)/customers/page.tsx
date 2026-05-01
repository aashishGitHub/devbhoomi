"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi, type User } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
    customer: "bg-blue-100 text-blue-700",
    wholesaler: "bg-purple-100 text-purple-700",
    admin: "bg-green-100 text-green-700",
};

export default function CustomersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await adminApi.listCustomers(page);
            setUsers(resp.items);
            setTotal(resp.total);
            setTotalPages(resp.total_pages);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load customers");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Customers</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage customer accounts ({total} total)</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <div className="admin-card overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="table-th">Name</th>
                            <th className="table-th">Email</th>
                            <th className="table-th">Phone</th>
                            <th className="table-th">Role</th>
                            <th className="table-th">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="table-td text-center py-12">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="table-td text-center text-gray-400 py-12 text-sm">
                                    No customers yet.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/60">
                                    <td className="table-td font-medium text-gray-800 text-sm">{u.name}</td>
                                    <td className="table-td text-sm">{u.email}</td>
                                    <td className="table-td text-sm text-gray-500">{u.phone || "—"}</td>
                                    <td className="table-td">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_COLORS[u.role] ?? "bg-gray-100"}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="table-td text-xs text-gray-400">{formatDate(u.created_at)}</td>
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
