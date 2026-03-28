import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Customers</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage customer accounts (B2C and B2B)</p>
            </div>
            <div className="admin-card p-12 text-center text-gray-400 text-sm">
                Customer list — connect backend API to populate.
            </div>
        </div>
    );
}
