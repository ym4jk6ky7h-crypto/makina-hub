import Link from "next/link";
import { EventActions } from "@/components/events/event-actions";
import { EventTimingBadge } from "@/components/events/event-timing-badge";
import type { Event } from "@/types/database";
import { formatDate } from "@/lib/utils";

type EventCompactRowProps = {
  event: Event;
};

/** Fila densa para revisar muchos eventos seguidos (Fase 6). */
export function EventCompactRow({ event }: EventCompactRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/10 py-3 last:border-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <time
          dateTime={event.event_date}
          className="w-24 shrink-0 text-xs font-semibold tabular-nums text-makina-cyan sm:w-28 sm:text-sm"
        >
          {formatDate(event.event_date)}
        </time>
        <div className="min-w-0 flex-1">
          <div className="mb-1 sm:hidden">
            <EventTimingBadge eventDate={event.event_date} />
          </div>
          <Link
            href={`/eventos/${event.slug}`}
            className="block font-semibold leading-snug hover:text-makina-pink focus-visible:rounded-sm"
          >
            {event.title}
          </Link>
          <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
            {event.city} · {event.venue}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end pl-[calc(6rem+0.75rem)] sm:pl-0">
        <EventActions event={event} compact />
      </div>
    </div>
  );
}
