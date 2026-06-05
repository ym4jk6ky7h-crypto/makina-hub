import { EventCompactRow } from "@/components/cards/event-compact-row";
import { EventListRow } from "@/components/cards/event-list-row";
import { groupByMonth } from "@/lib/event-timing";
import type { EventViewMode } from "@/lib/site-links";
import type { Event } from "@/types/database";

type EventsAgendaProps = {
  events: Event[];
  view?: EventViewMode;
};

export function EventsAgenda({ events, view = "cartel" }: EventsAgendaProps) {
  const months = groupByMonth(events);
  const compact = view === "compacta";

  return (
    <div className={compact ? "space-y-8" : "space-y-10"}>
      {months.map(({ monthKey, heading, items }) => (
        <section key={monthKey} aria-labelledby={`month-${monthKey}`}>
          <h2
            id={`month-${monthKey}`}
            className="mb-4 border-b border-white/10 pb-2 text-lg font-bold tracking-tight text-foreground"
          >
            {heading}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({items.length})
            </span>
          </h2>
          {compact ? (
            <div className="rounded-xl border border-white/10 bg-card/30 px-3 sm:px-4">
              {items.map((event) => (
                <EventCompactRow key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((event) => (
                <EventListRow key={event.id} event={event} showDateColumn />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
