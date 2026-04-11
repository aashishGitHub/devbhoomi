import type { Metadata } from "next";
import Link from "next/link";
import {
    Building2,
    TrendingDown,
    FileText,
    Truck,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Wholesale Portal",
    description: "Bulk purchasing and wholesale pricing for Himalayan heritage products. From the Land of Gods to Your Home.",
};

const BENEFITS = [
    {
        icon: TrendingDown,
        title: "Tiered Bulk Pricing",
        desc: "Up to 35% discount on orders above ₹50,000. Volume-based tiers start from ₹10,000.",
    },
    {
        icon: FileText,
        title: "GST Invoicing",
        desc: "Automated B2B invoices with GSTIN, HSN codes, and ITC-eligible breakdowns.",
    },
    {
        icon: Truck,
        title: "Priority Fulfillment",
        desc: "Dedicated logistics team, bulk packaging, and express dispatch within 48 hours.",
    },
    {
        icon: ShieldCheck,
        title: "Certification Support",
        desc: "Full NPOP organic certificates, batch traceability documents, and CoA on request.",
    },
];

export default function WholesalePage() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="bg-gradient-to-br from-forest to-stone text-white py-20 px-4">
                <div className="section max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
                        <Building2 className="h-4 w-4 text-misty" />
                        <span>B2B &amp; Wholesale Portal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                        Partner with Devtatva
                    </h1>
                    <p className="text-lg text-misty max-w-2xl mx-auto mb-8">
                        Access exclusive wholesale pricing on authentic Himalayan products. From the Land of Gods to Your Home.
                        Ideal for retailers, distributors, wellness centres, and export businesses.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/wholesale/apply"
                            className="bg-rust text-white px-6 py-3 rounded-xl font-semibold hover:bg-rust/90 transition-colors flex items-center gap-2"
                        >
                            Apply for Wholesale Account
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/quick-order"
                            className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                        >
                            Quick Order
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section py-16 mx-auto px-4">
                <h2 className="text-2xl font-bold text-forest font-display text-center mb-10">
                    Why partner with us?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BENEFITS.map((b) => (
                        <div key={b.title} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                            <div className="bg-forest/10 p-3 rounded-xl w-fit mb-4">
                                <b.icon className="h-5 w-5 text-forest" />
                            </div>
                            <h3 className="font-semibold text-forest mb-2 text-sm">{b.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing tiers */}
            <section className="bg-white py-16 px-4">
                <div className="section mx-auto">
                    <h2 className="text-2xl font-bold text-forest font-display text-center mb-10">
                        Volume Pricing Tiers
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-100 rounded-2xl overflow-hidden">
                            <thead>
                                <tr className="bg-forest text-white text-sm">
                                    <th className="px-5 py-3 text-left font-semibold">Order Value</th>
                                    <th className="px-5 py-3 text-left font-semibold">Discount</th>
                                    <th className="px-5 py-3 text-left font-semibold">Shipping</th>
                                    <th className="px-5 py-3 text-left font-semibold">Payment Terms</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    ["₹10,000 – ₹24,999", "10%", "Free", "Prepaid"],
                                    ["₹25,000 – ₹49,999", "18%", "Free + Priority", "Prepaid / Net-7"],
                                    ["₹50,000 – ₹99,999", "25%", "Free + Priority", "Net-15"],
                                    ["₹1,00,000+", "35%", "Free + Dedicated", "Net-30 + Credit Line"],
                                ].map(([range, disc, ship, payment], i) => (
                                    <tr
                                        key={range}
                                        className={i % 2 === 0 ? "bg-white" : "bg-cream/40"}
                                    >
                                        <td className="px-5 py-3 font-medium text-forest">{range}</td>
                                        <td className="px-5 py-3 text-rust font-bold">{disc}</td>
                                        <td className="px-5 py-3 text-gray-600">{ship}</td>
                                        <td className="px-5 py-3 text-gray-600">{payment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
