import { cn } from "@/lib/cn";
import { Icon } from "@/lib/icons";
import { formatCount } from "@/lib/format";

interface RatingProps {
  value: number;
  reviews?: number;
  size?: number;
  className?: string;
}

export function Rating({ value, reviews, size = 14, className }: RatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Icon name="star" size={size} className="text-primary fill-primary" />
      <span className="nums text-sm font-bold text-ink">{value.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="nums text-xs text-muted">({formatCount(reviews)})</span>
      )}
    </span>
  );
}
