import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { EventActions } from "@/components/events/event-actions";
import { EventTimingBadge } from "@/components/events/event-timing-badge";
import type { Event } from "@/types/database";
import { formatDate } from "@/lib/utils";

type EventListRowProps = {
  event: Event;
  showDateColumn?: boolean;
};

export function EventListRow({ event, showDateColumn = true }: EventListRowProps) {
  return (
    <div className="glass-card-hover grid gap-4 rounded-2xl p-4 sm:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]">
      {showDateColumn && (
        <div className="hidden text-sm font-semibold text-makina-cyan sm:block sm:pt-2">
          {formatDate(event.event_date)}
        </div>
      )}
      <div className="min-w-0">
        <Link
          href={`/eventos/${event.slug}`}
          className="group flex flex-col gap-4 sm:flex-row sm:items-stretch"
        >
          <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl bg-secondary sm:aspect-[4/5] sm:w-44 lg:w-52">
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={`Cartel: ${event.title}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="208px"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-makina-pink/20 to-makina-purple/20 text-2xl font-bold text-white/20">
                MH
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
            <EventTimingBadge eventDate={event.event_date} />
            <p className="text-sm font-medium text-makina-cyan sm:hidden">
              {formatDate(event.event_date)}
            </p>
            <h3 className="text-lg font-semibold leading-tight group-hover:text-makina-pink">
              {event.title}
            </h3>
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              <span className="hidden items-center gap-1.5 sm:flex">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(event.event_date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.city} · {event.venue}
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
        </Link>
        <EventActions event={event} compact />
      </div>
    </div>
  );
}
