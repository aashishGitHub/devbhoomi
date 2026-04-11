"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Sacred", href: "/products?category=sacred" },
  { label: "Foods", href: "/products?category=foods" },
  { label: "Wellness", href: "/products?category=wellness" },
  { label: "Wholesale", href: "/wholesale" },
];

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-snow/95 backdrop-blur-md border-b border-muted/20 shadow-sm">
      <div className="section">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span className="text-xl font-bold text-forest tracking-tight">
              Devtatva
            </span>
            <span className="text-[10px] text-muted tracking-widest uppercase">
              Himalayan Heritage
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium text-forest/70",
                  "hover:text-forest hover:bg-forest/6 transition-colors duration-150"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Link
              href="/products"
              className="p-2 rounded-lg text-forest/70 hover:text-forest hover:bg-forest/6 transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Account */}
            <Link
              href="/login"
              className="hidden sm:flex p-2 rounded-lg text-forest/70 hover:text-forest hover:bg-forest/6 transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-forest/70 hover:text-forest hover:bg-forest/6 transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rust text-snow text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-forest/70 hover:text-forest hover:bg-forest/6 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-muted/20 bg-snow">
          <div className="section py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-forest hover:bg-forest/6 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-muted/20 mt-2 pt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-forest hover:bg-forest/6 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
