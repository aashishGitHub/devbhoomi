import type { Metadata } from "next";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const metadata: Metadata = { title: "B2B / Wholesale" };

const PENDING_ACCOUNTS = [
    {
        id: "B2B-001",
        company: "Himalayan Exports Pvt Ltd",
        contact: "Suresh Joshi",
        email: "suresh@himexports.in",
        gstin: "05AABCH1234A1Z5",
        requestedAt: "2025-01-30",
        creditRequested: 50000,
    },
    {
        id: "B2B-002",
        company: "Sacred Roots Distributors",
        contact: "Lakshmi Patel",
        email: "lakshmi@sacredroots.com",
        gstin: "27AABCS5678B2Z3",
        requestedAt: "2025-01-29",
        creditRequested: 100000,
    },
    {
        id: "B2B-003",
        company: "Deva Trading Co.",
        contact: "Amit Rawat",
        email: "amit@devatrading.com",
        gstin: "07AABCD9012C3Z1",
        requestedAt: "2025-01-28",
        creditRequested: 25000,
    },
];

export default function B2BPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">B2B / Wholesale</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    Review wholesale account applications and manage credit lines
                </p>
            </div>

            {/* Pending approvals */}
            <div className="admin-card overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <h2 className="text-sm font-semibold text-gray-700">
                        Pending Approvals ({PENDING_ACCOUNTS.length})
                    </h2>
                </div>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="table-th">Company</th>
                            <th className="table-th">Contact</th>
                            <th className="table-th">GSTIN</th>
                            <th className="table-th">Credit Requested</th>
                            <th className="table-th">Request Date</th>
                            <th className="table-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PENDING_ACCOUNTS.map((account) => (
                            <tr key={account.id} className="hover:bg-gray-50/60">
                                <td className="table-td">
                                    <p className="font-medium text-gray-800">{account.company}</p>
                                    <p className="text-xs text-gray-400">{account.id}</p>
                                </td>
                                <td className="table-td">
                                    <p className="text-gray-700">{account.contact}</p>
                                    <p className="text-xs text-gray-400">{account.email}</p>
                                </td>
                                <td className="table-td font-mono text-xs">{account.gstin}</td>
                                <td className="table-td font-semibold text-forest">
                                    ₹{account.creditRequested.toLocaleString("en-IN")}
                                </td>
                                <td className="table-td text-gray-400">{account.requestedAt}</td>
                                <td className="table-td">
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg hover:bg-green-200 transition-colors font-medium">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Approve
                                        </button>
                                        <button className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors font-medium">
                                            <XCircle className="h-3.5 w-3.5" />
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
