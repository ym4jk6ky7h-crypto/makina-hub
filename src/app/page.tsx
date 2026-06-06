import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles, Zap } from "lucide-react";
import { EventCard } from "@/components/cards/event-card";
import { ArtistCard } from "@/components/cards/artist-card";
import { ReleaseCard } from "@/components/cards/release-card";
import { TrackCard } from "@/components/cards/track-card";
import { SessionCard } from "@/components/cards/session-card";
import { HomeStatsBar } from "@/components/home/home-stats-bar";
import { HomeFeatured } from "@/components/home/home-featured";
import { HomeQuickDiscover } from "@/components/home/home-quick-discover";
import {
  CarouselItem,
  ResponsiveCardRow,
} from "@/components/layout/responsive-card-row";
import { SectionHeader } from "@/components/layout/section-header";
import { HomeSectionEmpty } from "@/components/ui/home-section-empty";
import { SearchBar } from "@/components/search/search-bar";
import { SetupRequired } from "@/components/setup/setup-required";
import { EmptyDatabase } from "@/components/setup/empty-database";
import { Button } from "@/components/ui/button";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { resolveSessionPlay } from "@/lib/session-play";
import type { NewReleaseWithRelations } from "@/types/database";
import {
  getHomeStats,
  listArtists,
  listEvents,
  listNewReleases,
  listSessions,
  listTracks,
} from "@/services";

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan las credenciales reales. Abre makina-hub/CLAVES-SUPABASE.env y pega tu URL y clave de Supabase." />
    );
  }

  try {
    const [events, artists, tracks, sessions, releases, stats] = await Promise.all([
      listEvents(),
      listArtists({ limit: 12 }),
      listTracks({ limit: 6 }),
      listSessions({ limit: 4 }),
      listNewReleases({ limit: 4 }).catch((): NewReleaseWithRelations[] => []),
      getHomeStats(),
    ]);

    if (artists.length === 0) {
      return (
        <div className="bg-hero-gradient">
          <EmptyDatabase />
        </div>
      );
    }

    const monthLabel = new Date().toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });

    const nextEvent = events[0] ?? null;
    const featuredSession =
      sessions.find((s) => resolveSessionPlay(s).videoId) ?? sessions[0] ?? null;

    return (
      <div>
        <section className="relative min-h-[520px] overflow-hidden border-b border-white/5 lg:min-h-[580px]">
          <Image
            src={SITE_IMAGES.heroHome}
            alt="Multitud en festival de música electrónica"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-hero-gradient opacity-70" />
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-20" />

          <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-16 lg:min-h-[580px] lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-makina-pink/40 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-makina-pink backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                {stats.eventsThisMonth} eventos en {monthLabel}
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                La escena{" "}
                <span className="text-gradient-makina">mákina & remember</span>{" "}
                en un solo lugar
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/75">
                {stats.artists} artistas · {stats.eventsUpcoming} fiestas próximas ·
                temas, sesiones y sellos de la cultura mákina catalana.
              </p>
              <div className="mt-8 max-w-lg">
                <SearchBar placeholder="Buscar Skudero, Flying Free, eventos…" />
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:mt-8">
                <Link href="/eventos" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="makina"
                    className="h-12 w-full gap-2 text-base sm:w-auto sm:min-w-[200px]"
                  >
                    <Calendar className="h-5 w-5" />
                    Ver agenda
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                  <Link
                    href="/artistas"
                    className="text-muted-foreground transition-colors hover:text-makina-pink"
                  >
                    Artistas
                  </Link>
                  <Link
                    href="/musica"
                    className="text-muted-foreground transition-colors hover:text-makina-pink"
                  >
                    Música
                  </Link>
                  <Link
                    href="/novedades"
                    className="text-muted-foreground transition-colors hover:text-makina-pink"
                  >
                    Novedades
                  </Link>
                  <Link
                    href="/sesiones"
                    className="text-muted-foreground transition-colors hover:text-makina-pink"
                  >
                    Sesiones
                  </Link>
                  <Link
                    href="/ask"
                    className="inline-flex items-center gap-1 text-makina-cyan hover:underline"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Ask AI
                  </Link>
                </div>
              </div>
            </div>

            <HomeStatsBar stats={stats} />
          </div>
        </section>

        <HomeFeatured nextEvent={nextEvent} featuredSession={featuredSession} />
        <HomeQuickDiscover />

        <section className="border-b border-white/5 bg-card/40 py-6">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {stats.artists} artistas en la plataforma
            </p>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artistas/${artist.slug}`}
                  className="group flex w-[72px] shrink-0 snap-start flex-col items-center gap-2"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/10 transition-all group-hover:ring-makina-pink group-hover:shadow-makina-glow-sm">
                    <Image
                      src={getArtistImageUrl(artist.name, artist.image_url, artist.slug)}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <span className="max-w-[72px] truncate text-center text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    {artist.name}
                  </span>
                </Link>
              ))}
              <Link
                href="/artistas"
                className="flex w-[72px] shrink-0 snap-start flex-col items-center justify-center gap-1"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-makina-pink/40 bg-makina-pink/5 text-makina-pink">
                  +
                </div>
                <span className="text-xs font-medium text-makina-pink">Todos</span>
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 lg:px-8">
          <section className="rounded-2xl border border-white/5 bg-makina-mesh p-6 sm:p-8">
            <SectionHeader
              title="Próximos eventos"
              subtitle={`${stats.eventsUpcoming} en agenda · desliza en móvil`}
              href="/eventos"
              linkLabel="Ver agenda"
            />
            {events.length > 0 ? (
              <ResponsiveCardRow desktopGrid="lg:grid lg:grid-cols-4 lg:gap-4">
                {events.slice(0, 4).map((event) => (
                  <CarouselItem key={event.id}>
                    <EventCard event={event} />
                  </CarouselItem>
                ))}
              </ResponsiveCardRow>
            ) : (
              <HomeSectionEmpty
                className="mt-6"
                message="No hay eventos próximos en la agenda."
                actionLabel="Ver agenda completa"
                actionHref="/eventos?fecha=all"
              />
            )}
          </section>

          <section>
            <SectionHeader
              title="Artistas destacados"
              subtitle={`${stats.artists} referentes de la escena catalana`}
              href="/artistas"
            />
            {artists.length > 0 ? (
              <ResponsiveCardRow desktopGrid="lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
                {artists.slice(0, 6).map((artist) => (
                  <CarouselItem
                    key={artist.id}
                    className="w-[min(72vw,220px)] lg:w-auto"
                  >
                    <ArtistCard artist={artist} />
                  </CarouselItem>
                ))}
              </ResponsiveCardRow>
            ) : (
              <HomeSectionEmpty
                className="mt-6"
                message="El roster de artistas se está preparando."
                actionLabel="Explorar artistas"
                actionHref="/artistas"
              />
            )}
          </section>

          {releases.length > 0 && (
            <section className="rounded-2xl border border-makina-pink/10 bg-makina-mesh p-6 sm:p-8">
              <SectionHeader
                title="Nuevas producciones"
                subtitle={
                  stats.releases > 0
                    ? `${stats.releases} lanzamientos en catálogo`
                    : "Lanzamientos recientes"
                }
                href="/novedades"
              />
              <ResponsiveCardRow desktopGrid="lg:grid lg:grid-cols-4 lg:gap-4">
                {releases.map((release) => (
                  <CarouselItem key={release.id}>
                    <ReleaseCard release={release} variant="featured" />
                  </CarouselItem>
                ))}
              </ResponsiveCardRow>
            </section>
          )}

          <section className="rounded-2xl border border-white/5 bg-card/30 p-6 sm:p-8">
            <SectionHeader
              title="Temas destacados"
              subtitle={`${stats.tracks} temas en el catálogo`}
              href="/musica"
            />
            {tracks.length > 0 ? (
              <ResponsiveCardRow desktopGrid="lg:grid lg:grid-cols-3 lg:gap-4">
                {tracks.map((track) => (
                  <CarouselItem
                    key={track.id}
                    className="w-[min(88vw,340px)] lg:w-auto"
                  >
                    <TrackCard track={track} />
                  </CarouselItem>
                ))}
              </ResponsiveCardRow>
            ) : (
              <HomeSectionEmpty
                className="mt-6"
                message="Aún no hay temas en el catálogo."
                actionLabel="Ir a Música"
                actionHref="/musica"
              />
            )}
          </section>

          <section>
            <SectionHeader
              title="Últimas sesiones"
              subtitle={`${stats.sessions} sets en YouTube`}
              href="/sesiones"
            />
            {sessions.length > 0 ? (
              <ResponsiveCardRow desktopGrid="lg:grid lg:grid-cols-4 lg:gap-4">
                {sessions.map((session) => (
                  <CarouselItem key={session.id}>
                    <SessionCard session={session} />
                  </CarouselItem>
                ))}
              </ResponsiveCardRow>
            ) : (
              <HomeSectionEmpty
                className="mt-6"
                message="Las sesiones en YouTube se cargarán pronto."
                actionLabel="Ver sesiones"
                actionHref="/sesiones"
              />
            )}
          </section>
        </div>
      </div>
    );
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : formatSupabaseError(error);
    return <SetupRequired message={message} />;
  }
}
