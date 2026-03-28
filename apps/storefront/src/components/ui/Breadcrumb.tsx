import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm text-forest/60", className)}
    >
      <Link href="/" className="hover:text-forest transition-colors">
        <Home className="w-3.5 h-3.5" aria-label="Home" />
      </Link>
      {items.slice(1).map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" aria-hidden="true" />
          {item.href === "#" ? (
            <span className="text-forest font-medium truncate max-w-[200px]">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-forest transition-colors"
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
