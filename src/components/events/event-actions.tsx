import { CalendarPlus, Download, MapPin } from "lucide-react";
import { ShareEventButton } from "@/components/events/share-event-button";
import { Button } from "@/components/ui/button";
import { googleCalendarUrl, googleMapsUrl } from "@/lib/event-links";
import type { Event } from "@/types/database";
import { cn } from "@/lib/utils";

type EventActionsProps = {
  event: Pick<Event, "slug" | "title" | "description" | "event_date" | "venue" | "city">;
  compact?: boolean;
};

export function EventActions({ event, compact = false }: EventActionsProps) {
  const maps = googleMapsUrl(event.venue, event.city);
  const calendar = googleCalendarUrl(event);
  const ics = `/api/calendar/${event.slug}`;

  return (
    <div
      className={cn("flex flex-wrap gap-2", compact ? "mt-3" : "mt-6")}
      role="group"
      aria-label="Acciones del evento"
    >
      <a href={maps} target="_blank" rel="noopener noreferrer">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-makina-cyan/30 bg-makina-cyan/5 hover:bg-makina-cyan/10"
        >
          <MapPin className="h-4 w-4 text-makina-cyan" />
          Cómo llegar
        </Button>
      </a>
      <a href={calendar} target="_blank" rel="noopener noreferrer">
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <CalendarPlus className="h-4 w-4" />
          Google Calendar
        </Button>
      </a>
      <a href={ics} download={`${event.slug}.ics`}>
        <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Download className="h-4 w-4" />
          .ics
        </Button>
      </a>
      <ShareEventButton title={event.title} slug={event.slug} compact />
    </div>
  );
}
