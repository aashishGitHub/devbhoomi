import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-forest/80"
          >
            {label}
            {props.required && (
              <span className="text-rust ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border bg-snow px-4 py-2.5 text-sm text-forest placeholder:text-muted/70",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-muted/50 hover:border-muted",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-0.5" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-forest/50">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
