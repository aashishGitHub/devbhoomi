"use client";

import { Bell, Search } from "lucide-react";

export function AdminHeader() {
    return (
        <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-4 px-6 flex-shrink-0">
            {/* Search */}
            <div className="flex-1 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="search"
                    placeholder="Search orders, products…"
                    className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest bg-gray-50"
                />
            </div>

            <div className="ml-auto flex items-center gap-3">
                {/* Notifications */}
                <button
                    className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-rust rounded-full border-2 border-white" />
                </button>

                {/* Avatar */}
                <button className="h-8 w-8 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center uppercase">
                    A
                </button>
            </div>
        </header>
    );
}
