import { EventListRow } from "@/components/cards/event-list-row";
import { groupByMonth } from "@/lib/event-timing";
import type { Event } from "@/types/database";

type EventsAgendaProps = {
  events: Event[];
};

export function EventsAgenda({ events }: EventsAgendaProps) {
  const months = groupByMonth(events);

  return (
    <div className="space-y-10">
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
          <div className="space-y-6">
            {items.map((event) => (
              <EventListRow key={event.id} event={event} showDateColumn />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
