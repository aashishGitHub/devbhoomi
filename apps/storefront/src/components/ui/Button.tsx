import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "rust";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  /** Render as child element (e.g. Next.js Link) */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      asChild = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variants = {
      primary:
        "bg-forest text-snow hover:bg-forest/90 active:scale-[0.98] shadow-sm",
      secondary:
        "bg-misty text-forest hover:bg-misty/80 active:scale-[0.98]",
      outline:
        "border-2 border-forest text-forest bg-transparent hover:bg-forest hover:text-snow active:scale-[0.98]",
      ghost:
        "text-forest hover:bg-forest/8 active:scale-[0.98]",
      rust:
        "bg-rust text-snow hover:bg-rust/90 active:scale-[0.98] shadow-sm",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3.5 text-base",
    };

    // When asChild=true, Slot (from @radix-ui/react-slot) calls React.Children.only()
    // internally, so it must receive exactly ONE React element child.
    // The loading spinner must not be rendered as a sibling in that case.
    const content = asChild ? (
      children
    ) : (
      <>
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </>
    );

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";
