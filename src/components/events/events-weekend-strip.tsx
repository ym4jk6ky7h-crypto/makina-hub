import { EventListRow } from "@/components/cards/event-list-row";
import { getCurrentWeekendRangeLabel } from "@/lib/event-timing";
import type { Event } from "@/types/database";

type EventsWeekendStripProps = {
  events: Event[];
};

export function EventsWeekendStrip({ events }: EventsWeekendStripProps) {
  if (events.length === 0) return null;

  return (
    <section
      className="mb-10 rounded-2xl border border-makina-cyan/20 bg-makina-cyan/[0.04] p-5 sm:p-6"
      aria-labelledby="weekend-events"
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-makina-cyan">
          {getCurrentWeekendRangeLabel()}
        </p>
        <h2 id="weekend-events" className="mt-1 font-display text-2xl font-bold tracking-tight">
          Este fin de semana
          <span className="ml-2 text-base font-normal text-muted-foreground">
            · {events.length} {events.length === 1 ? "fiesta" : "fiestas"}
          </span>
        </h2>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <EventListRow key={event.id} event={event} showDateColumn={false} />
        ))}
      </div>
    </section>
  );
}
