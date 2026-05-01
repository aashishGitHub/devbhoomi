import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CheckCircle,
    FileText,
    ShieldCheck,
    TrendingDown,
    Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Wholesale Portal",
    description:
        "Bulk purchasing and wholesale pricing for Himalayan heritage products. From the Land of Gods to Your Home.",
};

const HIGHLIGHTS = [
    {
        label: "Starting order",
        value: formatINR(10000),
        note: "For wholesale access",
    },
    {
        label: "Top discount",
        value: "35%",
        note: "On ₹1,00,000+ orders",
    },
    {
        label: "Payment terms",
        value: "Net 30",
        note: "After approval",
    },
];

const BENEFITS = [
    {
        icon: TrendingDown,
        title: "Tiered bulk pricing",
        desc: "Automatic volume discounts that scale from trial orders to full pallet buying.",
    },
    {
        icon: FileText,
        title: "GST invoicing",
        desc: "Clear wholesale invoices with tax breakup, HSN-ready details, and order records.",
    },
    {
        icon: Truck,
        title: "Priority fulfillment",
        desc: "Bulk packing, quicker dispatch, and a logistics flow designed for repeat buyers.",
    },
    {
        icon: ShieldCheck,
        title: "Traceability support",
        desc: "Product origin, batch details, and certification references for trusted sourcing.",
    },
];

const PRICING_TIERS = [
    {
        range: `${formatINR(10000)} – ${formatINR(24999)}`,
        discount: "10%",
        shipping: "Free",
        terms: "Prepaid",
        bestFor: "First-time wholesale buyers",
    },
    {
        range: `${formatINR(25000)} – ${formatINR(49999)}`,
        discount: "18%",
        shipping: "Free + priority",
        terms: "Prepaid / Net-7",
        bestFor: "Regular retail restock",
    },
    {
        range: `${formatINR(50000)} – ${formatINR(99999)}`,
        discount: "25%",
        shipping: "Free + priority",
        terms: "Net-15",
        bestFor: "Temple & distributor orders",
    },
    {
        range: `${formatINR(100000)}+`,
        discount: "35%",
        shipping: "Free + dedicated",
        terms: "Net-30 + credit line",
        bestFor: "High-volume partners",
    },
];

const STEPS = [
    {
        step: "01",
        title: "Apply for wholesale access",
        desc: "Share your business details and product interests so we can review your account.",
    },
    {
        step: "02",
        title: "Get approved and assigned a tier",
        desc: "We confirm your eligibility, pricing slab, and any credit or tax terms.",
    },
    {
        step: "03",
        title: "Order fast, reorder faster",
        desc: "Use the quick-order flow for bulk SKUs, or contact our team for custom needs.",
    },
];

const AUDIENCE = ["Temples", "Retail stores", "Wellness buyers", "Export partners"];

export default function WholesalePage() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest/95 to-stone text-snow">
                <div className="absolute inset-0 opacity-15">
                    <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-misty/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-rust/20 blur-3xl" />
                </div>

                <div className="section relative z-10 py-20 lg:py-28">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
                        <div className="max-w-2xl">
                            <Badge className="mb-5 border-white/20 bg-white/10 text-snow">
                                B2B &amp; Wholesale Portal
                            </Badge>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-snow">
                                Wholesale pricing that still feels premium and easy to use
                            </h1>
                            <p className="mt-5 max-w-xl text-lg sm:text-xl text-misty leading-relaxed">
                                Buy sacred items, Himalayan foods, and wellness products in bulk with clear
                                tiers, fast ordering, and support for approved credit terms.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/wholesale/apply"
                                    className="inline-flex items-center gap-2 rounded-xl bg-rust px-5 py-3 text-sm font-semibold text-snow transition-colors hover:bg-rust/90"
                                >
                                    Apply for Wholesale Account
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/quick-order"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-snow transition-colors hover:bg-white/15"
                                >
                                    Open Quick Order
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-snow/80 underline-offset-4 transition-colors hover:text-snow hover:underline"
                                >
                                    Need custom terms?
                                </Link>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-2.5">
                                {AUDIENCE.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-snow/85"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md lg:p-7">
                            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                                <Building2 className="h-5 w-5 text-misty" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-snow/55">
                                        Wholesale at a glance
                                    </p>
                                    <p className="text-sm text-snow/70">
                                        Built for temples, stores, and repeat buyers
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 py-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                                {HIGHLIGHTS.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-white/10 bg-[#091519]/20 p-4"
                                    >
                                        <p className="text-xs uppercase tracking-widest text-snow/55">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-snow">{item.value}</p>
                                        <p className="mt-1 text-xs text-snow/65">{item.note}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-snow">
                                    <CheckCircle className="h-4 w-4 text-misty" />
                                    Useful, not just pretty
                                </div>
                                <ul className="mt-3 space-y-2 text-sm text-snow/75">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-misty" />
                                        Tiered pricing for bulk buyers
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-misty" />
                                        Quick order matrix for fast replenishment
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-misty" />
                                        Credit support after approval
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section py-16 lg:py-20">
                <SectionIntro
                    eyebrow="Why partner with us"
                    title="The wholesale flow stays consistent with the rest of Devtatva"
                    description="Premium visuals, clear cards, and practical actions — built for both browsing and buying."
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {BENEFITS.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-muted/20 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
                        >
                            <div className="mb-4 w-fit rounded-xl bg-forest/10 p-3">
                                <item.icon className="h-5 w-5 text-forest" />
                            </div>
                            <h3 className="text-sm font-semibold text-forest">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-forest/65">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing tiers */}
            <section className="border-y border-muted/20 bg-white py-16 lg:py-20">
                <div className="section">
                    <SectionIntro
                        eyebrow="Volume pricing"
                        title="Clear tiers, easy to understand"
                        description="Keep the pricing transparent so buyers know exactly where they stand."
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {PRICING_TIERS.map((tier) => (
                            <div
                                key={tier.range}
                                className="rounded-2xl border border-muted/20 bg-cream p-6 shadow-card"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                                            Order band
                                        </p>
                                        <h3 className="mt-1 text-lg font-bold text-forest">{tier.range}</h3>
                                    </div>
                                    <span className="rounded-full bg-rust/10 px-2.5 py-1 text-xs font-semibold text-rust">
                                        {tier.discount}
                                    </span>
                                </div>

                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex items-center justify-between gap-3 border-b border-muted/10 pb-2">
                                        <span className="text-forest/60">Shipping</span>
                                        <span className="font-medium text-forest">{tier.shipping}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 border-b border-muted/10 pb-2">
                                        <span className="text-forest/60">Payment</span>
                                        <span className="font-medium text-forest">{tier.terms}</span>
                                    </div>
                                    <p className="pt-1 text-sm text-forest/65">
                                        Best for: {tier.bestFor}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-forest/10 bg-forest/5 p-4 text-sm text-forest/70">
                        Need a custom quote, credit line, or a larger order? Apply first and our team can
                        tailor the next steps.
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="section py-16 lg:py-20">
                <SectionIntro
                    eyebrow="How it works"
                    title="Fast path from application to repeat ordering"
                    description="A simple flow that keeps the page useful for both first-time and returning buyers."
                />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {STEPS.map((step) => (
                        <div
                            key={step.step}
                            className="rounded-3xl border border-muted/20 bg-white p-6 shadow-card"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rust/10 text-sm font-bold text-rust">
                                    {step.step}
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Step</p>
                                    <h3 className="text-base font-semibold text-forest">{step.title}</h3>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-forest/65">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="section pb-20 lg:pb-24">
                <div className="relative overflow-hidden rounded-3xl border border-rust/20 bg-gradient-to-br from-rust/10 to-rust/5 p-8 lg:p-10">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
                    </div>
                    <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-forest">
                                Ready to stock Devtatva?
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-forest/70">
                                Apply for wholesale access, move to quick-order ordering, and keep a clean path
                                to repeat purchases without losing the brand experience.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                            <Link
                                href="/wholesale/apply"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-snow transition-colors hover:bg-forest/90"
                            >
                                Apply Now
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/quick-order"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-forest/20 bg-white px-5 py-3 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
                            >
                                Quick Order
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function SectionIntro({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rust">{eyebrow}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-forest">{title}</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-forest/65">{description}</p>
        </div>
    );
}
