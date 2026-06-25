"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { regions } from "@/data/regions";
import { cn } from "@/lib/cn";

export function RegionPicker({ className }: { className?: string }) {
  const { t, tl } = useI18n();
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-start hover:bg-surface-2 transition-colors"
      >
        <Icon name="pin" size={18} className="text-primary" />
        <span className="leading-tight">
          <span className="block text-[0.7rem] text-muted">{t("nav.deliverTo")}</span>
          <span className="block text-sm font-bold text-ink-strong">{tl(region.name)}</span>
        </span>
        <Icon name="chevron-down" size={14} className="text-muted" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 z-30 min-w-52 max-h-72 overflow-auto rounded-lg border border-border bg-bg p-1.5 shadow-[var(--shadow-lg)]">
          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRegion(r);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-surface-2 transition-colors",
                r.id === region.id ? "font-bold text-ink-strong" : "text-ink",
              )}
            >
              {tl(r.name)}
              {r.id === region.id && <Icon name="check" size={16} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
