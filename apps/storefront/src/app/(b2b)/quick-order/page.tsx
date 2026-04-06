"use client";

import { useState, useCallback } from "react";
import { Plus, Minus, Trash2, Loader2, ShoppingCart } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export const dynamic = "force-dynamic";

interface QuickOrderRow {
    sku: string;
    name: string;
    pricePerUnit: number;
    quantity: number;
}

const CATALOGUE: QuickOrderRow[] = [
    { sku: "HH-001", name: "Himalayan Raw Honey 500g", pricePerUnit: 450, quantity: 0 },
    { sku: "HH-002", name: "Rudraksha Mala (108 Beads)", pricePerUnit: 600, quantity: 0 },
    { sku: "HH-003", name: "Shilajit Pure Resin 10g", pricePerUnit: 900, quantity: 0 },
    { sku: "HH-004", name: "Tagar (Valerian Root) 50g", pricePerUnit: 200, quantity: 0 },
    { sku: "HH-005", name: "Char Dham Pooja Kit", pricePerUnit: 600, quantity: 0 },
    { sku: "HH-006", name: "Himalayan Turmeric Powder 200g", pricePerUnit: 180, quantity: 0 },
    { sku: "HH-007", name: "Brahmi Leaf Powder 100g", pricePerUnit: 250, quantity: 0 },
    { sku: "HH-008", name: "Cold-Pressed Mustard Oil 1L", pricePerUnit: 350, quantity: 0 },
];

function getDiscount(total: number): number {
    if (total >= 100000) return 0.35;
    if (total >= 50000) return 0.25;
    if (total >= 25000) return 0.18;
    if (total >= 10000) return 0.10;
    return 0;
}

export default function QuickOrderPage() {
    const [rows, setRows] = useState<QuickOrderRow[]>(CATALOGUE);
    const [submitting, setSubmitting] = useState(false);
    const { addItem, openCart } = useCartStore();

    const updateQty = useCallback((sku: string, delta: number) => {
        setRows((prev) =>
            prev.map((r) =>
                r.sku === sku ? { ...r, quantity: Math.max(0, r.quantity + delta) } : r
            )
        );
    }, []);

    const setQty = useCallback((sku: string, value: number) => {
        setRows((prev) =>
            prev.map((r) => (r.sku === sku ? { ...r, quantity: Math.max(0, value) } : r))
        );
    }, []);

    const activeRows = rows.filter((r) => r.quantity > 0);
    const subtotal = activeRows.reduce((sum, r) => sum + r.pricePerUnit * r.quantity, 0);
    const discount = getDiscount(subtotal);
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    const addAllToCart = () => {
        activeRows.forEach((r) => {
            addItem({
                product_id: r.sku,
                name: r.name,
                slug: r.sku,
                price_inr: r.pricePerUnit * (1 - discount),
                quantity: r.quantity,
                image: "",
            });
        });
        openCart();
    };

    return (
        <div className="min-h-screen bg-cream py-10 px-4">
            <div className="section mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-forest font-display">Quick Order</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Set quantities for bulk ordering — discounts applied automatically.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Product table */}
                    <div className="xl:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-forest/5 text-xs text-gray-500 uppercase">
                                    <th className="px-4 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-right">Unit Price</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr
                                        key={row.sku}
                                        className={`border-t border-gray-50 transition-colors ${
                                            row.quantity > 0 ? "bg-cream/20" : "hover:bg-gray-50/60"
                                        }`}
                                    >
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-forest">{row.name}</p>
                                            <p className="text-xs text-gray-400 font-mono">{row.sku}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                                            {formatINR(row.pricePerUnit)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => updateQty(row.sku, -1)}
                                                    className="p-1 rounded text-forest hover:bg-forest/10 transition-colors"
                                                    aria-label="Decrease"
                                                >
                                                    {row.quantity === 1 ? (
                                                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                                    ) : (
                                                        <Minus className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                                <input
                                                    type="number"
                                                    value={row.quantity || ""}
                                                    onChange={(e) =>
                                                        setQty(row.sku, parseInt(e.target.value) || 0)
                                                    }
                                                    className="w-14 text-center text-sm border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-forest/30"
                                                    min={0}
                                                    placeholder="0"
                                                />
                                                <button
                                                    onClick={() => updateQty(row.sku, 1)}
                                                    className="p-1 rounded text-forest hover:bg-forest/10 transition-colors"
                                                    aria-label="Increase"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-forest">
                                            {row.quantity > 0
                                                ? formatINR(row.pricePerUnit * row.quantity)
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary panel */}
                    <div className="bg-white rounded-2xl shadow-card p-6 h-fit sticky top-6">
                        <h2 className="text-sm font-semibold text-forest mb-4">Order Summary</h2>

                        {activeRows.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">
                                Set quantities on the left to see your summary
                            </p>
                        ) : (
                            <>
                                <div className="space-y-2 text-sm mb-4">
                                    {activeRows.map((r) => (
                                        <div key={r.sku} className="flex justify-between text-gray-600">
                                            <span className="truncate flex-1 mr-2">
                                                {r.name} × {r.quantity}
                                            </span>
                                            <span>{formatINR(r.pricePerUnit * r.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>{formatINR(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Wholesale Discount ({(discount * 100).toFixed(0)}%)</span>
                                            <span>−{formatINR(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-forest text-base pt-1 border-t border-gray-100">
                                        <span>Total</span>
                                        <span>{formatINR(total)}</span>
                                    </div>
                                </div>

                                {discount === 0 && subtotal > 0 && (
                                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-3">
                                        Add {formatINR(10000 - subtotal)} more to unlock 10% wholesale discount
                                    </p>
                                )}

                                <button
                                    onClick={addAllToCart}
                                    disabled={submitting}
                                    className="w-full bg-forest text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                                >
                                    {submitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ShoppingCart className="h-4 w-4" />
                                    )}
                                    Add All to Cart
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
