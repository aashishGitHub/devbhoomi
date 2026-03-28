import { cn } from "@/lib/utils";

const ORDERS = [
    { id: "ORD-8821", customer: "Priya Sharma", amount: 2499, status: "delivered", date: "2025-01-30" },
    { id: "ORD-8820", customer: "Rahul Gupta", amount: 1150, status: "processing", date: "2025-01-30" },
    { id: "ORD-8819", customer: "Anjali Nair", amount: 3800, status: "shipped", date: "2025-01-29" },
    { id: "ORD-8818", customer: "Devendra Singh", amount: 580, status: "pending", date: "2025-01-29" },
    { id: "ORD-8817", customer: "Meera Rawat", amount: 7200, status: "delivered", date: "2025-01-28" },
];

const STATUS_STYLES: Record<string, string> = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-amber-100 text-amber-700",
    pending: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
};

export function RecentOrders() {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="table-th rounded-tl-lg">Order ID</th>
                        <th className="table-th">Customer</th>
                        <th className="table-th">Amount</th>
                        <th className="table-th">Status</th>
                        <th className="table-th rounded-tr-lg">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="table-td font-mono text-xs text-stone">{order.id}</td>
                            <td className="table-td font-medium text-gray-800">{order.customer}</td>
                            <td className="table-td">₹{order.amount.toLocaleString("en-IN")}</td>
                            <td className="table-td">
                                <span
                                    className={cn(
                                        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                                        STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"
                                    )}
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td className="table-td text-gray-400">{order.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
