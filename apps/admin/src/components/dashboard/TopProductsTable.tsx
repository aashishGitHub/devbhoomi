const PRODUCTS = [
    { name: "Himalayan Raw Honey", sales: 342, revenue: 171_000, stock: 80 },
    { name: "Rudraksha Mala (108)", sales: 218, revenue: 130_800, stock: 45 },
    { name: "Shilajit Pure Resin", sales: 195, revenue: 175_500, stock: 12 },
    { name: "Tagar (Valerian) 50g", sales: 167, revenue: 33_400, stock: 200 },
    { name: "Char Dham Pooja Kit", sales: 143, revenue: 85_800, stock: 30 },
];

export function TopProductsTable() {
    return (
        <div className="space-y-3">
            {PRODUCTS.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="h-1 bg-gray-100 rounded-full flex-1">
                                <div
                                    className="h-full bg-forest rounded-full"
                                    style={{ width: `${(product.sales / 342) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 w-10 text-right">
                                {product.sales}
                            </span>
                        </div>
                    </div>
                    {product.stock <= 15 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                            Low
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
