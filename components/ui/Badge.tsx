import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/lib/icons";

type Tone = "neutral" | "success" | "warning" | "info" | "primary";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-[oklch(0.45_0.12_60)]",
  info: "bg-accent-soft text-accent-strong",
  primary: "bg-primary-soft text-[oklch(0.45_0.1_70)]",
};

interface BadgeProps {
  tone?: Tone;
  icon?: IconName;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-bold leading-none",
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}
