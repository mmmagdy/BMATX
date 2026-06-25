import { Icon, type IconName } from "@/lib/icons";
import { categoryById } from "@/data/categories";
import { cn } from "@/lib/cn";

/** Per-category soft tint so the grid reads varied, not identical. */
const tints: Record<string, { from: string; to: string; fg: string }> = {
  cement: { from: "oklch(0.95 0.02 250)", to: "oklch(0.9 0.04 255)", fg: "oklch(0.5 0.1 255)" },
  steel: { from: "oklch(0.95 0.015 25)", to: "oklch(0.9 0.03 30)", fg: "oklch(0.5 0.11 30)" },
  blocks: { from: "oklch(0.95 0.025 70)", to: "oklch(0.91 0.05 75)", fg: "oklch(0.52 0.1 70)" },
  tiles: { from: "oklch(0.95 0.02 320)", to: "oklch(0.91 0.04 325)", fg: "oklch(0.52 0.11 320)" },
  paint: { from: "oklch(0.95 0.025 200)", to: "oklch(0.91 0.05 205)", fg: "oklch(0.5 0.11 205)" },
  wood: { from: "oklch(0.95 0.03 80)", to: "oklch(0.91 0.05 70)", fg: "oklch(0.5 0.1 65)" },
  plumbing: { from: "oklch(0.95 0.02 220)", to: "oklch(0.91 0.04 225)", fg: "oklch(0.5 0.1 225)" },
  electrical: { from: "oklch(0.96 0.03 95)", to: "oklch(0.92 0.06 90)", fg: "oklch(0.52 0.12 85)" },
  tools: { from: "oklch(0.95 0.015 160)", to: "oklch(0.91 0.035 165)", fg: "oklch(0.5 0.1 165)" },
  aggregates: { from: "oklch(0.95 0.02 60)", to: "oklch(0.91 0.04 55)", fg: "oklch(0.5 0.09 55)" },
};

const fallback = { from: "oklch(0.96 0 0)", to: "oklch(0.92 0 0)", fg: "oklch(0.55 0 0)" };

export function ProductThumb({
  categoryId,
  className,
  iconSize = 72,
}: {
  categoryId: string;
  className?: string;
  iconSize?: number;
}) {
  const cat = categoryById(categoryId);
  const tint = tints[categoryId] ?? fallback;
  return (
    <div
      className={cn("relative grid place-items-center overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${tint.from}, ${tint.to})` }}
    >
      <span
        className="absolute -bottom-4 -end-3 opacity-20"
        style={{ color: tint.fg }}
        aria-hidden
      >
        <Icon name={(cat?.icon ?? "package") as IconName} size={iconSize * 1.7} strokeWidth={1} />
      </span>
      <span style={{ color: tint.fg }}>
        <Icon name={(cat?.icon ?? "package") as IconName} size={iconSize} strokeWidth={1.3} />
      </span>
    </div>
  );
}
