import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { eventPosterUrl } from "@/lib/events/event-poster";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { Event } from "@/types/database";
import { formatDate, cn } from "@/lib/utils";

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
        className="group glass-card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch"
      >
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl bg-secondary sm:w-36">
          <Image
            src={poster}
            alt={`Cartel: ${event.title}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="144px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="text-sm font-medium text-makina-cyan">
            {formatDate(event.event_date)}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-tight group-hover:text-makina-pink">
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
    <MediaCardShell>
      <Link
        href={detailHref}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-secondary"
      >
        <Image
          src={poster}
          alt={`Cartel: ${event.title}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 320px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="flex items-center gap-1 text-xs text-makina-cyan">
            <Calendar className="h-3 w-3" />
            {formatDate(event.event_date)}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold leading-tight text-white">
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
      <div className="p-4">
        <Link
          href={detailHref}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-makina-pink to-makina-purple px-3 py-2.5 text-sm font-semibold text-white",
            "transition-opacity hover:opacity-90"
          )}
        >
          Ver evento
        </Link>
      </div>
    </MediaCardShell>
  );
}
