"use client";

import { Icon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/cn";

export interface Segment<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  wrap = false,
}: {
  options: Segment<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  /** allow segments to wrap to a 2-row grid when they can't fit one line (e.g. 4+ options on mobile) */
  wrap?: boolean;
}) {
  return (
    <div
      role="tablist"
      className={cn("flex rounded-md border border-border bg-surface-2 p-1", wrap && "flex-wrap", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-[0.45rem] px-3 py-2 text-sm font-bold transition-all sm:px-4",
              wrap && "min-w-[6.5rem]",
              active
                ? "bg-bg text-ink-strong shadow-[var(--shadow-sm)]"
                : "text-muted hover:text-ink",
            )}
          >
            {o.icon && <Icon name={o.icon} size={16} className="shrink-0" />}
            <span className="truncate">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
