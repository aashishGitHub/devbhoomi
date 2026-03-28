"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { date: "Jan 1", revenue: 12400 },
    { date: "Jan 5", revenue: 18900 },
    { date: "Jan 10", revenue: 14200 },
    { date: "Jan 15", revenue: 23100 },
    { date: "Jan 20", revenue: 19800 },
    { date: "Jan 25", revenue: 31500 },
    { date: "Jan 30", revenue: 28200 },
];

export function RevenueChart() {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#254B5A" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#254B5A" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#254B5A"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
