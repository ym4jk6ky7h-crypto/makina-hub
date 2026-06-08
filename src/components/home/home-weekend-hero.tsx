import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Headphones, MapPin } from "lucide-react";
import { EventTimingBadge } from "@/components/events/event-timing-badge";
import { Button } from "@/components/ui/button";
import { eventPosterUrl } from "@/lib/events/event-poster";
import {
  getCurrentWeekendRangeLabel,
  getEventTimingBadge,
  type EventTimingBadge as TimingLabel,
} from "@/lib/event-timing";
import { formatYoutubeDuration } from "@/lib/format-duration";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
import { resolveSessionPlay } from "@/lib/session-play";
import { getSessionThumbnail } from "@/lib/session-thumbnail";
import type { EventWithRelations, SessionWithRelations } from "@/types/database";
import { formatDate } from "@/lib/utils";

type HomeWeekendHeroProps = {
  weekendEvents: EventWithRelations[];
  fallbackEvent: EventWithRelations | null;
  featuredSession: SessionWithRelations | null;
};

function sectionTitle(isWeekend: boolean): string {
  return isWeekend ? "Este fin de semana" : "Próximo en agenda";
}

function sectionSubtitle(isWeekend: boolean, count: number): string {
  if (isWeekend) {
    return `${getCurrentWeekendRangeLabel()} · ${count} ${count === 1 ? "fiesta" : "fiestas"}`;
  }
  return "La siguiente cita en la agenda mákina";
}

export function HomeWeekendHero({
  weekendEvents,
  fallbackEvent,
  featuredSession,
}: HomeWeekendHeroProps) {
  const isWeekend = weekendEvents.length > 0;
  const primary = weekendEvents[0] ?? fallbackEvent;
  const secondary = isWeekend ? weekendEvents.slice(1) : [];

  if (!primary) return null;

  const primaryPoster = eventPosterUrl(primary.title, primary.image_url);
  const sessionPlay = featuredSession ? resolveSessionPlay(featuredSession) : null;
  const sessionThumb = featuredSession ? getSessionThumbnail(featuredSession) : null;

  return (
    <section className="relative overflow-hidden border-b border-makina-cyan/20 bg-gradient-to-b from-makina-cyan/[0.08] via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_0%,rgba(34,211,238,0.12),transparent)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-makina-cyan">
              Agenda remember
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {sectionTitle(isWeekend)}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {sectionSubtitle(isWeekend, isWeekend ? weekendEvents.length : 1)}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 border-makina-cyan/30">
            <Link href="/eventos" className="gap-2">
              Ver agenda completa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
          <Link
            href={`/eventos/${primary.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/50 shadow-2xl shadow-black/40 transition-all hover:border-makina-cyan/40 hover:shadow-makina-cyan/10"
          >
            <div className="relative aspect-[3/4] max-h-[520px] w-full sm:aspect-[4/5] lg:aspect-[3/4] lg:max-h-none">
              <Image
                src={primaryPoster}
                alt={`Cartel: ${primary.title}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                unoptimized={preferUnoptimizedImage(primaryPoster)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent lg:from-background/60" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8">
              <EventTimingBadge eventDate={primary.event_date} />
              <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {primary.title}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-makina-cyan" />
                  {formatDate(primary.event_date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-makina-cyan" />
                  {primary.city} · {primary.venue}
                </span>
              </div>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-makina-cyan group-hover:underline">
                Ver ficha del evento
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </div>
          </Link>

          <div className="flex min-w-0 flex-col gap-6">
            {secondary.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  También este fin de semana
                </p>
                <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:pb-0 xl:grid-cols-3">
                  {secondary.map((event) => (
                    <WeekendMiniCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {featuredSession && sessionPlay?.videoId && (
              <Link
                href={`/sesiones/${featuredSession.slug}#reproductor`}
                className="group glass-card-hover flex flex-1 flex-col overflow-hidden sm:flex-row"
              >
                <div className="relative aspect-video w-full shrink-0 bg-black sm:w-44 lg:w-52">
                  {sessionThumb?.url ? (
                    <Image
                      src={sessionThumb.url}
                      alt=""
                      fill
                      className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                      sizes="208px"
                      unoptimized={!sessionThumb.fromYoutube}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-makina-purple/40 to-makina-pink/20" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 shadow-lg">
                      <Headphones className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-makina-purple">
                    Sesión reciente
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold leading-tight group-hover:text-makina-cyan">
                    {featuredSession.title}
                  </h3>
                  {sessionPlay.durationSeconds != null && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatYoutubeDuration(sessionPlay.durationSeconds)} · YouTube
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-makina-cyan">
                    Escuchar
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )}

            {!secondary.length && !featuredSession && (
              <div className="glass-card flex flex-1 flex-col justify-center p-6 text-center lg:text-left">
                <p className="font-display text-lg font-semibold">Más fiestas en camino</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explora la agenda completa: macrofestivales, Makina Legends y salas remember.
                </p>
                <Button asChild variant="makina" className="mt-4 w-full sm:w-auto">
                  <Link href="/eventos">Explorar eventos</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function WeekendMiniCard({ event }: { event: EventWithRelations }) {
  const poster = eventPosterUrl(event.title, event.image_url);

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group w-[min(68vw,200px)] shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-card/60 transition-all hover:border-makina-cyan/40 hover:shadow-lg hover:shadow-makina-cyan/10 lg:w-auto"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image
          src={poster}
          alt={`Cartel: ${event.title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
          unoptimized={preferUnoptimizedImage(poster)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <MiniTimingBadge eventDate={event.event_date} />
          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-white">
            {event.title}
          </p>
          <p className="mt-1 text-xs text-white/70">{event.city}</p>
        </div>
      </div>
    </Link>
  );
}

function MiniTimingBadge({ eventDate }: { eventDate: string }) {
  const label = getEventTimingBadge(eventDate);
  if (!label) return null;

  const styles: Record<TimingLabel, string> = {
    Hoy: "bg-makina-pink/90 text-white",
    "Este fin de semana": "bg-makina-cyan/90 text-black",
  };

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[label]}`}
    >
      {label}
    </span>
  );
}
