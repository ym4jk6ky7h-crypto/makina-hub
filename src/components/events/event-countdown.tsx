import { getEventDaysUntil, formatEventCountdown } from "@/lib/event-timing";
import { cn } from "@/lib/utils";

type EventCountdownProps = {
  eventDate: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-2 text-sm font-bold sm:text-base",
};

export function EventCountdown({ eventDate, size = "md", className }: EventCountdownProps) {
  const days = getEventDaysUntil(eventDate);
  if (days == null) return null;

  const urgent = days <= 1;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wide",
        urgent
          ? "border-makina-pink/50 bg-makina-pink/20 text-makina-pink"
          : "border-makina-cyan/40 bg-makina-cyan/10 text-makina-cyan",
        sizeStyles[size],
        className
      )}
    >
      {formatEventCountdown(days)}
    </span>
  );
}
