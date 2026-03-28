import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Analytics</h1>
                <p className="text-sm text-gray-500 mt-0.5">In-depth sales and traffic reports</p>
            </div>
            <div className="admin-card p-12 text-center text-gray-400 text-sm">
                Advanced analytics charts will appear here once the backend API is connected.
            </div>
        </div>
    );
}
