import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { EventCountdown } from "@/components/events/event-countdown";
import { EventActions } from "@/components/events/event-actions";
import { EventTimingBadge } from "@/components/events/event-timing-badge";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { eventPosterUrl } from "@/lib/events/event-poster";
import { favoriteFromEvent } from "@/lib/favorites/build-item";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
import type { EventWithRelations } from "@/types/database";
import { formatDate } from "@/lib/utils";

type EventDetailHeroProps = {
  event: EventWithRelations;
};

export function EventDetailHero({ event }: EventDetailHeroProps) {
  const poster = eventPosterUrl(event.title, event.image_url);

  return (
    <section className="detail-hero-glow relative overflow-hidden border-b border-makina-cyan/20">
      <div className="absolute inset-0">
        <Image
          src={poster}
          alt=""
          fill
          className="scale-110 object-cover opacity-25 blur-2xl"
          sizes="100vw"
          priority
          unoptimized={preferUnoptimizedImage(poster)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/90 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(34,211,238,0.12),transparent)]" />
      </div>
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-15" />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-center lg:gap-12 lg:px-8 lg:py-14">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-makina-cyan/30 lg:mx-0">
          <Image
            src={poster}
            alt={`Cartel: ${event.title}`}
            fill
            className="object-cover"
            sizes="340px"
            priority
            unoptimized={preferUnoptimizedImage(poster)}
          />
        </div>

        <div className="text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <EventTimingBadge eventDate={event.event_date} />
            <EventCountdown eventDate={event.event_date} size="lg" />
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-makina-cyan">
            Evento mákina
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
          <div className="mt-6 flex flex-col gap-2 text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-6">
            <p className="flex items-center justify-center gap-2 lg:justify-start">
              <Calendar className="h-4 w-4 text-makina-cyan" />
              <span className="font-medium text-foreground">{formatDate(event.event_date)}</span>
            </p>
            <p className="flex items-center justify-center gap-2 lg:justify-start">
              <MapPin className="h-4 w-4 text-makina-cyan" />
              {event.venue} · {event.city}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <FavoriteButton item={favoriteFromEvent(event)} showLabel />
            <EventActions event={event} />
          </div>
        </div>
      </div>
    </section>
  );
}
