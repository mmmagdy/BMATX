"use client";

import { Icon } from "@/lib/icons";
import { cn } from "@/lib/cn";

interface QtyStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QtyStepper({ value, onChange, min = 1, size = "md", className }: QtyStepperProps) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const btn =
    "grid place-items-center text-ink hover:bg-surface-2 disabled:opacity-40 disabled:pointer-events-none transition-colors";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-border-strong bg-surface overflow-hidden",
        className,
      )}
    >
      <button
        type="button"
        aria-label="decrease"
        className={cn(btn, dim)}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Icon name="minus" size={16} />
      </button>
      <span className={cn("nums min-w-10 text-center font-bold text-ink-strong", size === "sm" && "min-w-8 text-sm")}>
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        className={cn(btn, dim)}
        onClick={() => onChange(value + 1)}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
