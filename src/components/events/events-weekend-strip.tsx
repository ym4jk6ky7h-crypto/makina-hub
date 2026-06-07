import { EventListRow } from "@/components/cards/event-list-row";
import type { Event } from "@/types/database";

type EventsWeekendStripProps = {
  events: Event[];
};

export function EventsWeekendStrip({ events }: EventsWeekendStripProps) {
  if (events.length === 0) return null;

  return (
    <section className="mb-10" aria-labelledby="weekend-events">
      <h2 id="weekend-events" className="mb-4 font-display text-xl font-bold tracking-tight">
        Este fin de semana
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({events.length})
        </span>
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <EventListRow key={event.id} event={event} showDateColumn={false} />
        ))}
      </div>
    </section>
  );
}
