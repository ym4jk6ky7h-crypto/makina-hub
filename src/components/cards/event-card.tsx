import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { EventCountdown } from "@/components/events/event-countdown";
import { EventTimingBadge } from "@/components/events/event-timing-badge";
import { eventPosterUrl } from "@/lib/events/event-poster";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { Event } from "@/types/database";
import { formatDate } from "@/lib/utils";

type EventCardProps = {
  event: Event;
  variant?: "grid" | "row";
};

export function EventCard({ event, variant = "grid" }: EventCardProps) {
  const poster = eventPosterUrl(event.title, event.image_url);
  const detailHref = `/eventos/${event.slug}`;

  if (variant === "row") {
    return (
      <Link
        href={detailHref}
        className="group card-lift glass-card-hover flex flex-col gap-4 border-makina-cyan/10 p-4 sm:flex-row sm:items-stretch"
      >
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl bg-secondary ring-1 ring-makina-cyan/20 sm:w-36">
          <Image
            src={poster}
            alt={`Cartel: ${event.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="144px"
            unoptimized={preferUnoptimizedImage(poster)}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <EventTimingBadge eventDate={event.event_date} />
            <EventCountdown eventDate={event.event_date} size="sm" />
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-makina-cyan">
            {formatDate(event.event_date)}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-tight group-hover:text-makina-cyan">
            {event.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {event.city} · {event.venue}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <MediaCardShell accent="event" className="card-lift">
      <Link href={detailHref} className="relative block aspect-[3/4] w-full overflow-hidden bg-secondary">
        <Image
          src={poster}
          alt={`Cartel: ${event.title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 320px"
          unoptimized={preferUnoptimizedImage(poster)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <EventTimingBadge eventDate={event.event_date} />
          <EventCountdown eventDate={event.event_date} size="sm" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-makina-cyan">
            <Calendar className="h-3 w-3" />
            {formatDate(event.event_date)}
          </p>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-tight text-white group-hover:text-makina-cyan">
            {event.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">
              {event.city} · {event.venue}
            </span>
          </p>
        </div>
      </Link>
    </MediaCardShell>
  );
}
