import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Settings</h1>
                <p className="text-sm text-gray-500 mt-0.5">Platform configuration and preferences</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["General", "Payment Gateways", "Shipping & Logistics", "Email Templates", "Tax Configuration", "API Keys"].map((section) => (
                    <div key={section} className="admin-card p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
                        <h3 className="text-sm font-semibold text-gray-800">{section}</h3>
                        <p className="text-xs text-gray-400 mt-1">Configure {section.toLowerCase()} settings</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
