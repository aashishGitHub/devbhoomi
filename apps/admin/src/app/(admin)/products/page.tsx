"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi, type Product } from "@/lib/api";
import { formatINR } from "@/lib/utils";

type ModalMode = "create" | "edit" | "inventory" | null;

const CATEGORIES = [
    { value: "", label: "All categories" },
    { value: "sacred", label: "Sacred & Ritual" },
    { value: "foods", label: "Himalayan Foods" },
    { value: "wellness", label: "Wellness & Ayurveda" },
];

const STATUS_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    out_of_stock: "bg-red-100 text-red-600",
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await adminApi.listProducts({
                page,
                per_page: 20,
                q: search || undefined,
                category: category || undefined,
            });
            setProducts(resp.items);
            setTotal(resp.total);
            setTotalPages(resp.total_pages);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [page, search, category]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await adminApi.deleteProduct(id);
            fetchProducts();
        } catch {
            alert("Failed to delete product");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-forest font-display">Products</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage your product catalogue ({total} products)
                    </p>
                </div>
                <button
                    onClick={() => { setEditProduct(null); setModalMode("create"); }}
                    className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-forest/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            {/* Search & filter */}
            <div className="admin-card p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="admin-card overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="table-th">Product</th>
                            <th className="table-th">Category</th>
                            <th className="table-th">Price</th>
                            <th className="table-th">Stock (Retail)</th>
                            <th className="table-th">Stock (Wholesale)</th>
                            <th className="table-th">Status</th>
                            <th className="table-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="table-td text-center py-12">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="table-td text-center text-gray-400 py-12 text-sm">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/60">
                                    <td className="table-td">
                                        <div className="flex items-center gap-3">
                                            {p.images?.[0] ? (
                                                <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                                                <p className="text-xs text-gray-400">{p.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-td">
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full capitalize">{p.category}</span>
                                    </td>
                                    <td className="table-td font-semibold text-sm">{formatINR(p.price?.inr ?? 0)}</td>
                                    <td className="table-td text-sm">
                                        <span className={p.inventory?.retail === 0 ? "text-red-600 font-semibold" : ""}>
                                            {p.inventory?.retail === 0 ? "sold out" : p.inventory?.retail ?? 0}
                                        </span>
                                    </td>
                                    <td className="table-td text-sm">{p.inventory?.wholesale ?? 0}</td>
                                    <td className="table-td">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] ?? "bg-gray-100"}`}>
                                            {p.status === "out_of_stock" ? "sold out" : p.status}
                                        </span>
                                    </td>
                                    <td className="table-td">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => { setEditProduct(p); setModalMode("inventory"); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-forest hover:bg-forest/10 transition-colors"
                                                title="Update inventory"
                                            >
                                                <Package className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => { setEditProduct(p); setModalMode("edit"); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-forest hover:bg-forest/10 transition-colors"
                                                title="Edit product"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id, p.name)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete product"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
                        <span>Page {page} of {totalPages}</span>
                        <div className="flex gap-1">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {modalMode === "inventory" && editProduct && (
                <InventoryModal
                    product={editProduct}
                    saving={saving}
                    onClose={() => setModalMode(null)}
                    onSave={async (retail, wholesale) => {
                        setSaving(true);
                        try {
                            await adminApi.updateInventory(editProduct.id, retail, wholesale);
                            setModalMode(null);
                            fetchProducts();
                        } catch { alert("Failed to update inventory"); }
                        finally { setSaving(false); }
                    }}
                />
            )}
            {(modalMode === "create" || modalMode === "edit") && (
                <ProductFormModal
                    mode={modalMode}
                    product={editProduct}
                    saving={saving}
                    onClose={() => setModalMode(null)}
                    onSave={async (data) => {
                        setSaving(true);
                        try {
                            if (modalMode === "create") {
                                await adminApi.createProduct(data);
                            } else if (editProduct) {
                                await adminApi.updateProduct(editProduct.id, data);
                            }
                            setModalMode(null);
                            fetchProducts();
                        } catch (err: unknown) {
                            alert(err instanceof Error ? err.message : "Save failed");
                        } finally { setSaving(false); }
                    }}
                />
            )}
        </div>
    );
}

// ── Inventory Modal ───────────────────────────────────────────────────────────

function InventoryModal({
    product,
    saving,
    onClose,
    onSave,
}: {
    product: Product;
    saving: boolean;
    onClose: () => void;
    onSave: (retail: number, wholesale: number) => void;
}) {
    const [retail, setRetail] = useState(product.inventory?.retail ?? 0);
    const [wholesale, setWholesale] = useState(product.inventory?.wholesale ?? 0);

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-forest mb-1">Update Inventory</h2>
                <p className="text-sm text-gray-500 mb-5">{product.name}</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Retail Stock</label>
                        <input
                            type="number"
                            min={0}
                            value={retail}
                            onChange={(e) => setRetail(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale Stock</label>
                        <input
                            type="number"
                            min={0}
                            value={wholesale}
                            onChange={(e) => setWholesale(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(retail, wholesale)}
                        disabled={saving}
                        className="px-4 py-2 text-sm bg-forest text-white rounded-lg font-semibold hover:bg-forest/90 disabled:opacity-60 flex items-center gap-2 transition-colors"
                    >
                        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Product Form Modal ────────────────────────────────────────────────────────

function ProductFormModal({
    mode,
    product,
    saving,
    onClose,
    onSave,
}: {
    mode: "create" | "edit";
    product: Product | null;
    saving: boolean;
    onClose: () => void;
    onSave: (data: Record<string, unknown>) => void;
}) {
    const [name, setName] = useState(product?.name ?? "");
    const [slug, setSlug] = useState(product?.slug ?? "");
    const [cat, setCat] = useState(product?.category ?? "sacred");
    const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [priceINR, setPriceINR] = useState(product?.price?.inr ?? 0);
    const [inventoryRetail, setInventoryRetail] = useState(product?.inventory?.retail ?? 0);
    const [inventoryWholesale, setInventoryWholesale] = useState(product?.inventory?.wholesale ?? 0);
    const [status, setStatus] = useState(product?.status ?? "active");
    const [images, setImages] = useState(product?.images?.join(", ") ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            slug: slug || undefined,
            category: cat,
            subcategory,
            description,
            price_inr: priceINR,
            inventory_retail: inventoryRetail,
            inventory_wholesale: inventoryWholesale,
            status,
            images: images.split(",").map((s) => s.trim()).filter(Boolean),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-forest mb-5">
                    {mode === "create" ? "Add New Product" : "Edit Product"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="Auto-generated from name"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
                            >
                                <option value="sacred">Sacred</option>
                                <option value="foods">Foods</option>
                                <option value="wellness">Wellness</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                            <input
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR) *</label>
                            <input
                                type="number"
                                required
                                min={0}
                                value={priceINR}
                                onChange={(e) => setPriceINR(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Retail Stock</label>
                            <input
                                type="number"
                                min={0}
                                value={inventoryRetail}
                                onChange={(e) => setInventoryRetail(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale Stock</label>
                            <input
                                type="number"
                                min={0}
                                value={inventoryWholesale}
                                onChange={(e) => setInventoryWholesale(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
                        <input
                            value={images}
                            onChange={(e) => setImages(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 text-sm bg-forest text-white rounded-lg font-semibold hover:bg-forest/90 disabled:opacity-60 flex items-center gap-2 transition-colors"
                        >
                            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {mode === "create" ? "Create Product" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
