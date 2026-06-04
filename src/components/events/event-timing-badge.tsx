import { Badge } from "@/components/ui/badge";
import {
  getEventTimingBadge,
  type EventTimingBadge,
} from "@/lib/event-timing";
import { cn } from "@/lib/utils";

const styles: Record<EventTimingBadge, string> = {
  Hoy: "border-makina-pink/40 bg-makina-pink/15 text-makina-pink",
  "Este fin de semana":
    "border-makina-cyan/40 bg-makina-cyan/10 text-makina-cyan",
};

export function EventTimingBadge({ eventDate }: { eventDate: string }) {
  const label = getEventTimingBadge(eventDate);
  if (!label) return null;

  return (
    <Badge
      className={cn("mb-2 w-fit border", styles[label])}
      variant="outline"
    >
      {label}
    </Badge>
  );
}
