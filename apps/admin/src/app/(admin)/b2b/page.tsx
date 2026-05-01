"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface WholesalerProfile {
    user_id: string;
    company_name: string;
    gstin: string;
    tier: string;
    approval_status: string;
    created_at: string;
}

export default function B2BPage() {
    const [profiles, setProfiles] = useState<WholesalerProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWholesalers = () => {
        setLoading(true);
        adminApi
            .listWholesalers()
            .then((resp) => setProfiles(resp.items))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchWholesalers(); }, []);

    const handleAction = async (userId: string, status: "approved" | "rejected") => {
        try {
            await adminApi.approveWholesaler(userId, status);
            fetchWholesalers();
        } catch {
            alert(`Failed to ${status} wholesaler`);
        }
    };

    const pending = profiles.filter((p) => p.approval_status === "pending");
    const approved = profiles.filter((p) => p.approval_status === "approved");
    const rejected = profiles.filter((p) => p.approval_status === "rejected");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">B2B / Wholesale</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    Review wholesale account applications and manage credit lines
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            {/* Pending approvals */}
            <div className="admin-card overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <h2 className="text-sm font-semibold text-gray-700">
                        Pending Approvals ({pending.length})
                    </h2>
                </div>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="table-th">Company</th>
                            <th className="table-th">GSTIN</th>
                            <th className="table-th">Tier</th>
                            <th className="table-th">Request Date</th>
                            <th className="table-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="table-td text-center py-12">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                                </td>
                            </tr>
                        ) : pending.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="table-td text-center text-gray-400 py-8 text-sm">
                                    No pending wholesale applications.
                                </td>
                            </tr>
                        ) : (
                            pending.map((p) => (
                                <tr key={p.user_id} className="hover:bg-gray-50/60">
                                    <td className="table-td font-medium text-gray-800">{p.company_name || "—"}</td>
                                    <td className="table-td font-mono text-xs">{p.gstin || "—"}</td>
                                    <td className="table-td capitalize">{p.tier}</td>
                                    <td className="table-td text-gray-400 text-xs">{formatDate(p.created_at)}</td>
                                    <td className="table-td">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAction(p.user_id, "approved")}
                                                className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200 transition-colors font-medium"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(p.user_id, "rejected")}
                                                className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                            >
                                                <XCircle className="h-3.5 w-3.5" />
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Approved wholesalers */}
            {approved.length > 0 && (
                <div className="admin-card overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <h2 className="text-sm font-semibold text-gray-700">Approved ({approved.length})</h2>
                    </div>
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="table-th">Company</th>
                                <th className="table-th">GSTIN</th>
                                <th className="table-th">Tier</th>
                                <th className="table-th">Since</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approved.map((p) => (
                                <tr key={p.user_id} className="hover:bg-gray-50/60">
                                    <td className="table-td font-medium">{p.company_name || "—"}</td>
                                    <td className="table-td font-mono text-xs">{p.gstin || "—"}</td>
                                    <td className="table-td capitalize">{p.tier}</td>
                                    <td className="table-td text-xs text-gray-400">{formatDate(p.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rejected */}
            {rejected.length > 0 && (
                <div className="admin-card overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <h2 className="text-sm font-semibold text-gray-700">Rejected ({rejected.length})</h2>
                    </div>
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="table-th">Company</th>
                                <th className="table-th">GSTIN</th>
                                <th className="table-th">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rejected.map((p) => (
                                <tr key={p.user_id} className="hover:bg-gray-50/60">
                                    <td className="table-td">{p.company_name || "—"}</td>
                                    <td className="table-td font-mono text-xs">{p.gstin || "—"}</td>
                                    <td className="table-td text-xs text-gray-400">{formatDate(p.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
