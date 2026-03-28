import type { Metadata } from "next";
import { Plus, Search, Filter } from "lucide-react";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-forest font-display">Products</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your product catalogue</p>
                </div>
                <a
                    href="/products/new"
                    className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-forest/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </a>
            </div>

            {/* Search & filter bar */}
            <div className="admin-card p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search products…"
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                </div>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white">
                    <option>All categories</option>
                    <option>Sacred &amp; Ritual</option>
                    <option>Himalayan Foods</option>
                    <option>Wellness &amp; Ayurveda</option>
                    <option>Spices &amp; Herbs</option>
                </select>
                <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 text-gray-500" />
                    Filters
                </button>
            </div>

            {/* Table placeholder */}
            <div className="admin-card overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="table-th w-12">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </th>
                            <th className="table-th">Product</th>
                            <th className="table-th">Category</th>
                            <th className="table-th">Price</th>
                            <th className="table-th">Stock</th>
                            <th className="table-th">Status</th>
                            <th className="table-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={7} className="table-td text-center text-gray-400 py-12 text-sm">
                                Products will appear here once the backend API is connected.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
