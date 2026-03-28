"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Layers } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/products", icon: Search, label: "Explore" },
  { href: "/cart", icon: ShoppingBag, label: "Cart" },
  { href: "/products?category=sacred", icon: Layers, label: "Sacred" },
  { href: "/login", icon: User, label: "Account" },
];

export function MobileNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-snow border-t border-muted/20 md:hidden pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);
          const isCart = href === "/cart";

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                isActive ? "text-forest" : "text-muted hover:text-forest"
              )}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-150",
                    isActive && "scale-110"
                  )}
                  aria-hidden="true"
                />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rust text-snow text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
