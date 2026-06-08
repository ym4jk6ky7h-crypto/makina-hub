import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Headphones, MapPin } from "lucide-react";
import { eventPosterUrl } from "@/lib/events/event-poster";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
import { formatYoutubeDuration } from "@/lib/format-duration";
import { resolveSessionPlay } from "@/lib/session-play";
import { getSessionThumbnail } from "@/lib/session-thumbnail";
import { formatDate } from "@/lib/utils";
import type { EventWithRelations, SessionWithRelations } from "@/types/database";

type HomeFeaturedProps = {
  nextEvent: EventWithRelations | null;
  featuredSession: SessionWithRelations | null;
};

export function HomeFeatured({ nextEvent, featuredSession }: HomeFeaturedProps) {
  if (!nextEvent && !featuredSession) return null;

  const eventPoster = nextEvent
    ? eventPosterUrl(nextEvent.title, nextEvent.image_url)
    : null;
  const sessionPlay = featuredSession
    ? resolveSessionPlay(featuredSession)
    : null;
  const sessionThumb = featuredSession
    ? getSessionThumbnail(featuredSession)
    : null;

  return (
    <section className="border-b border-white/5 bg-gradient-to-b from-makina-pink/5 to-transparent py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-2 lg:px-8">
        {nextEvent && (
          <Link
            href={`/eventos/${nextEvent.slug}`}
            className="group glass-card overflow-hidden transition-all hover:border-makina-pink/30"
          >
            <div className="relative aspect-[21/9] bg-secondary">
              {eventPoster ? (
                <Image
                  src={eventPoster}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={preferUnoptimizedImage(eventPoster)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-makina-pink/30 to-makina-purple/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-makina-pink">
                  Próximo evento
                </p>
                <h2 className="mt-1 font-display text-xl font-bold leading-tight sm:text-2xl">
                  {nextEvent.title}
                </h2>
                <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(nextEvent.event_date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {nextEvent.city}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm font-medium text-makina-pink group-hover:underline">
                Ver ficha del evento
              </span>
              <ArrowRight className="h-4 w-4 text-makina-pink transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        )}

        {featuredSession && sessionPlay?.videoId && (
          <Link
            href={`/sesiones/${featuredSession.slug}#reproductor`}
            className="group glass-card overflow-hidden transition-all hover:border-makina-cyan/30"
          >
            <div className="relative aspect-[21/9] bg-black">
              {sessionThumb?.url ? (
                <Image
                  src={sessionThumb.url}
                  alt=""
                  fill
                  className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={!sessionThumb.fromYoutube}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-makina-purple/40 to-makina-pink/20" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg">
                  <Headphones className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-makina-cyan">
                  Sesión destacada
                </p>
                <h2 className="mt-1 line-clamp-2 font-display text-xl font-bold leading-tight">
                  {featuredSession.title}
                </h2>
                {sessionPlay.durationSeconds != null && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatYoutubeDuration(sessionPlay.durationSeconds)} · YouTube
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm font-medium text-makina-cyan group-hover:underline">
                Escuchar sesión
              </span>
              <ArrowRight className="h-4 w-4 text-makina-cyan transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
