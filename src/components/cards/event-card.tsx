import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "@/types/database";
import { formatDate } from "@/lib/utils";

type EventCardProps = {
  event: Event;
  variant?: "grid" | "row";
};

export function EventCard({ event, variant = "grid" }: EventCardProps) {
  if (variant === "row") {
    return (
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
    );
  }

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group glass-card overflow-hidden transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={`Cartel: ${event.title}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-makina-pink/20 to-makina-purple/20 text-4xl font-bold text-white/20">
            MH
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="line-clamp-2 font-semibold leading-tight text-white">
            {event.title}
          </h3>
          <div className="mt-2 flex flex-col gap-1 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(event.event_date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {event.city} · {event.venue}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
