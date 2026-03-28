import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "heritage" | "organic" | "sale" | "new" | "outofstock";
}

const variants = {
  heritage: "bg-rust/10 text-rust border-rust/20",
  organic: "bg-green-50 text-green-700 border-green-200",
  sale: "bg-red-50 text-red-600 border-red-200",
  new: "bg-forest/10 text-forest border-forest/20",
  outofstock: "bg-muted/20 text-muted border-muted/30",
};

const labels = {
  heritage: "Heritage",
  organic: "Organic",
  sale: "Sale",
  new: "New",
  outofstock: "Out of Stock",
};

export function Badge({ variant = "heritage", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children ?? labels[variant]}
    </span>
  );
}
