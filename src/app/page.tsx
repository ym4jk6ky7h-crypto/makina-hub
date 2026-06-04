import Image from "next/image";
import Link from "next/link";
import { Calendar, Mic2, Music2, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { EventCard } from "@/components/cards/event-card";
import { ArtistCard } from "@/components/cards/artist-card";
import { ReleaseCard } from "@/components/cards/release-card";
import { TrackCard } from "@/components/cards/track-card";
import { SessionCard } from "@/components/cards/session-card";
import { SectionHeader } from "@/components/layout/section-header";
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
import type { NewReleaseWithRelations } from "@/types/database";
import {
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
    const [events, artists, tracks, sessions, releases] = await Promise.all([
      listEvents(),
      listArtists({ limit: 12 }),
      listTracks({ limit: 6 }),
      listSessions({ limit: 4 }),
      listNewReleases({ limit: 4 }).catch((): NewReleaseWithRelations[] => []),
    ]);

    if (artists.length === 0) {
      return (
        <div className="bg-hero-gradient">
          <EmptyDatabase />
        </div>
      );
    }

    return (
      <div>
        {/* Hero con imagen */}
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
                Mákina & remember · Catalunya
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                La escena{" "}
                <span className="text-gradient-makina">mákina & remember</span>{" "}
                en un solo lugar
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/75">
                Artistas, eventos, temas, sesiones y sellos. Datos reales de la
                cultura mákina catalana — de Pont Aeri a Makina Legends.
              </p>
              <div className="mt-8 max-w-lg">
                <SearchBar placeholder="Buscar Skudero, Flying Free, eventos…" />
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Link href="/eventos" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="makina"
                    className="h-12 w-full gap-2 text-base sm:w-auto"
                  >
                    <Calendar className="h-5 w-5" />
                    Ver eventos
                  </Button>
                </Link>
                <Link href="/artistas" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full gap-2 border-white/20 bg-black/30 text-base backdrop-blur-sm hover:bg-white/10 sm:w-auto"
                  >
                    <Mic2 className="h-5 w-5" />
                    Artistas
                  </Button>
                </Link>
                <Link href="/novedades" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full gap-2 border-makina-pink/40 bg-makina-pink/5 text-base sm:w-auto"
                  >
                    <ShoppingBag className="h-5 w-5 text-makina-pink" />
                    Novedades
                  </Button>
                </Link>
                <Link href="/ask" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full gap-2 border-makina-cyan/40 bg-makina-cyan/5 text-base sm:w-auto"
                  >
                    <Sparkles className="h-5 w-5 text-makina-cyan" />
                    Ask AI
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-3 sm:max-w-lg sm:gap-4">
              {[
                { value: String(artists.length), label: "Artistas", icon: Mic2 },
                { value: String(events.length), label: "Eventos", icon: Calendar },
                { value: String(tracks.length > 6 ? "117+" : tracks.length), label: "Temas", icon: Music2 },
              ].map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="glass-card flex flex-col items-center rounded-xl px-3 py-4 text-center sm:px-4"
                >
                  <Icon className="mb-1 h-4 w-4 text-makina-pink" />
                  <span className="font-display text-2xl font-bold sm:text-3xl">{value}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Strip de DJs */}
        <section className="border-b border-white/5 bg-card/40 py-6">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Artistas en la plataforma
            </p>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artistas/${artist.slug}`}
                  className="group flex shrink-0 flex-col items-center gap-2"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/10 transition-all group-hover:ring-makina-pink group-hover:shadow-makina-glow-sm">
                    <Image
                      src={getArtistImageUrl(artist.name, artist.image_url)}
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
                className="flex shrink-0 flex-col items-center justify-center gap-1 px-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-makina-pink/40 bg-makina-pink/5 text-makina-pink">
                  Ver
                </div>
                <span className="text-xs font-medium text-makina-pink">Ver todos</span>
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 lg:px-8">
          <section className="rounded-2xl border border-white/5 bg-makina-mesh p-6 sm:p-8">
            <SectionHeader
              title="Próximos eventos"
              subtitle="Remember, mákina y revival en Catalunya"
              href="/eventos"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {events.slice(0, 4).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              title="Artistas destacados"
              subtitle="Los referentes de la escena catalana"
              href="/artistas"
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {artists.slice(0, 6).map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>

          {releases.length > 0 && (
            <section className="rounded-2xl border border-makina-pink/10 bg-makina-mesh p-6 sm:p-8">
              <SectionHeader
                title="Nuevas producciones"
                subtitle="Lanzamientos recientes — compra en Beatport, Juno y más"
                href="/novedades"
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {releases.map((release) => (
                  <ReleaseCard key={release.id} release={release} variant="featured" />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-white/5 bg-card/30 p-6 sm:p-8">
            <SectionHeader
              title="Temas destacados"
              subtitle="Himnos remember y clásicos mákina"
              href="/musica"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              title="Últimas sesiones"
              subtitle="Sets históricos y revival en YouTube"
              href="/sesiones"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
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
