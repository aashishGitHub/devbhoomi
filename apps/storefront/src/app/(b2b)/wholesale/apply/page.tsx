"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Building2, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const applySchema = z.object({
    companyName: z.string().min(2, "Company name required"),
    gstin: z
        .string()
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format"),
    contactName: z.string().min(2, "Contact name required"),
    email: z.string().email("Valid email required"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Valid Indian mobile number required"),
    expectedMonthlyVolume: z.string().min(1, "Required"),
    businessType: z.enum(["retailer", "distributor", "wellness", "export", "other"]),
    message: z.string().optional(),
});

type ApplyValues = z.infer<typeof applySchema>;

export default function WholesaleApplyPage() {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ApplyValues>({ resolver: zodResolver(applySchema) });

    const onSubmit = async (data: ApplyValues) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/api/v1/b2b/apply`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );
        if (res.ok) setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream pt-20 px-4">
                <div className="text-center max-w-sm">
                    <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-forest font-display mb-2">
                        Application Submitted!
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Our wholesale team will review your application and get back to you within
                        2–3 business days.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-20 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-forest/10 p-2.5 rounded-xl">
                        <Building2 className="h-6 w-6 text-forest" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-forest font-display">Apply for Wholesale Account</h1>
                        <p className="text-sm text-gray-500">Fill in your business details below</p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white rounded-2xl shadow-card p-8 space-y-5"
                    noValidate
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Company name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name <span className="text-rust">*</span>
                            </label>
                            <input
                                {...register("companyName")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                placeholder="Himalayan Exports Pvt Ltd"
                            />
                            {errors.companyName && (
                                <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>
                            )}
                        </div>

                        {/* GSTIN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                GSTIN <span className="text-rust">*</span>
                            </label>
                            <input
                                {...register("gstin")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest/30"
                                placeholder="27AABCS1234A1Z5"
                            />
                            {errors.gstin && (
                                <p className="mt-1 text-xs text-red-500">{errors.gstin.message}</p>
                            )}
                        </div>

                        {/* Business type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Type <span className="text-rust">*</span>
                            </label>
                            <select
                                {...register("businessType")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
                            >
                                <option value="retailer">Retailer</option>
                                <option value="distributor">Distributor / Wholesaler</option>
                                <option value="wellness">Wellness Centre / Spa</option>
                                <option value="export">Export Business</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Contact name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Person <span className="text-rust">*</span>
                            </label>
                            <input
                                {...register("contactName")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                placeholder="Suresh Joshi"
                            />
                            {errors.contactName && (
                                <p className="mt-1 text-xs text-red-500">{errors.contactName.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Email <span className="text-rust">*</span>
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                placeholder="suresh@company.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Number <span className="text-rust">*</span>
                            </label>
                            <input
                                type="tel"
                                {...register("phone")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                placeholder="9876543210"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Expected volume */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expected Monthly Volume <span className="text-rust">*</span>
                            </label>
                            <select
                                {...register("expectedMonthlyVolume")}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
                            >
                                <option value="">Select range</option>
                                <option value="10k-25k">₹10,000 – ₹25,000</option>
                                <option value="25k-50k">₹25,000 – ₹50,000</option>
                                <option value="50k-1l">₹50,000 – ₹1,00,000</option>
                                <option value="1l+">₹1,00,000+</option>
                            </select>
                            {errors.expectedMonthlyVolume && (
                                <p className="mt-1 text-xs text-red-500">{errors.expectedMonthlyVolume.message}</p>
                            )}
                        </div>

                        {/* Message */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Information
                            </label>
                            <textarea
                                {...register("message")}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                                placeholder="Tell us about your business, specific product interests, or any questions…"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-forest text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Submitting…" : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}
