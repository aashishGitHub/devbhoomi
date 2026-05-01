import type { Metadata } from "next";
import { CreditCard, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Credit Account" };

export default function CreditPage() {
    return (
        <div className="min-h-screen bg-cream pt-20 pb-12 px-4">
            <div className="section mx-auto max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-stone/10 p-2.5 rounded-xl">
                        <CreditCard className="h-6 w-6 text-stone" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-forest font-display">Credit Account</h1>
                        <p className="text-sm text-gray-500">
                            Manage your wholesale credit line and outstanding invoices
                        </p>
                    </div>
                </div>

                {/* Credit summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Credit Limit", value: "₹1,00,000", icon: CreditCard, color: "text-forest", bg: "bg-forest/10" },
                        { label: "Available Credit", value: "₹72,500", icon: Clock, color: "text-stone", bg: "bg-stone/10" },
                        { label: "Overdue Amount", value: "₹0", icon: AlertTriangle, color: "text-green-600", bg: "bg-green-50" },
                    ].map((item) => (
                        <div key={item.label} className="bg-white rounded-2xl p-5 shadow-card flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${item.bg} flex-shrink-0`}>
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{item.label}</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invoice table placeholder */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">Outstanding Invoices</h2>
                    </div>
                    <div className="p-12 text-center text-gray-400 text-sm">
                        Invoices will appear here once the backend API is connected.
                    </div>
                </div>
            </div>
        </div>
    );
}
