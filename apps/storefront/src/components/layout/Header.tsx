"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { clearAuthCookie } from "@/lib/jwt";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Sacred", href: "/products?category=sacred" },
  { label: "Foods", href: "/products?category=foods" },
  { label: "Wellness", href: "/products?category=wellness" },
  { label: "Wholesale", href: "/wholesale" },
];

// Pages that have a light background at the top (no dark hero section).
// On these pages, the header must always use dark/contrasting colors.
const LIGHT_BG_PAGES = [
  "/login",
  "/register",
  "/cart",
  "/checkout",
  "/credit",
  "/quick-order",
  "/wholesale/apply",
  "/account",
];

export function Header() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if current page starts with a light background (no hero section)
  const isLightPage = LIGHT_BG_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  // Once user scrolls, header becomes dark on any page — same as lightPage style
  const isDark = isLightPage || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isDark
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
              isDark ? "text-snow" : "text-snow"
            )}>
              Devtatva
            </span>
            <span className={cn(
              "text-[9px] tracking-widest uppercase transition-colors duration-300",
              isDark ? "text-misty/70" : "text-snow/60"
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
                  isDark
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
                isDark ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
              )}
              aria-label="Search products"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </Link>

            {isAuthenticated && user ? (
              <Link
                href="/account"
                className={cn(
                  "hidden sm:flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all duration-200",
                  isDark ? "hover:bg-snow/10" : "hover:bg-snow/10"
                )}
                aria-label="My Account"
              >
                <span className="w-7 h-7 rounded-full bg-forest text-snow flex items-center justify-center text-xs font-bold">
                  {user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </span>
                <span className={cn(
                  "text-sm font-medium max-w-[80px] truncate",
                  isDark ? "text-snow/70" : "text-snow/80"
                )}>
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "hidden sm:flex p-2 rounded-full transition-all duration-200",
                  isDark ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
                )}
                aria-label="Sign In"
              >
                <User className="w-5 h-5" aria-hidden="true" />
              </Link>
            )}

            <button
              onClick={openCart}
              className={cn(
                "relative p-2 rounded-full transition-all duration-200",
                isDark ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
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
                isDark ? "text-snow/70 hover:text-snow hover:bg-snow/10" : "text-snow/80 hover:text-snow hover:bg-snow/10"
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
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-snow/70 hover:text-snow hover:bg-snow/10 transition-colors flex items-center gap-2"
                    >
                      <span className="w-6 h-6 rounded-full bg-forest text-snow flex items-center justify-center text-xs font-bold">
                        {user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                      {user.name.split(" ")[0]}
                    </Link>
                    <button
                      onClick={() => {
                        clearAuth();
                        clearAuthCookie();
                        setMobileOpen(false);
                        window.location.href = "/login";
                      }}
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium text-snow/50 hover:text-rust hover:bg-snow/5 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-snow/70 hover:text-snow hover:bg-snow/10 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}



