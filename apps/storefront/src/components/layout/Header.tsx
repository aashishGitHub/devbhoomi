"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#091519]/95 backdrop-blur-md border-b border-snow/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="section">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span className={cn(
              "text-xl font-bold tracking-tight transition-colors duration-300",
              scrolled ? "text-snow" : "text-snow"
            )}>
              Devtatva
            </span>
            <span className={cn(
              "text-[9px] tracking-widest uppercase transition-colors duration-300",
              scrolled ? "text-misty/70" : "text-snow/60"
            )}>
              From the Land of Gods
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  scrolled
                    ? "text-snow/70 hover:text-snow hover:bg-snow/10"
                    : "text-snow/80 hover:text-snow hover:bg-snow/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/products"
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                scrolled ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
              )}
              aria-label="Search products"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </Link>

            <Link
              href="/login"
              className={cn(
                "hidden sm:flex p-2 rounded-full transition-all duration-200",
                scrolled ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
              )}
              aria-label="Account"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </Link>

            <button
              onClick={openCart}
              className={cn(
                "relative p-2 rounded-full transition-all duration-200",
                scrolled ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
              )}
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-rust text-snow text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>

            <button
              className={cn(
                "md:hidden p-2 rounded-full transition-all duration-200",
                scrolled ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
              )}
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-snow/10 bg-[#091519]/98 backdrop-blur-md"
          >
            <div className="section py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-snow/70 hover:text-snow hover:bg-snow/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-snow/10 mt-2 pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-snow/70 hover:text-snow hover:bg-snow/10 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In / Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}



