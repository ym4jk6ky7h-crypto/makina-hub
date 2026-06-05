import Image from "next/image";
import { Instagram, Music2, Youtube } from "lucide-react";
import { ArtistBio } from "@/components/artists/artist-bio";
import { ArtistListenNow } from "@/components/artists/artist-listen-now";
import { ArtistMetaChips } from "@/components/artists/artist-meta-chips";
import { EventCard } from "@/components/cards/event-card";
import { TrackCard } from "@/components/cards/track-card";
import { SessionCard } from "@/components/cards/session-card";
import { SectionHeader } from "@/components/layout/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { parseProductionsFromBio } from "@/lib/artists/artist-bio-utils";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { personJsonLd } from "@/lib/seo/json-ld";
import { getArtistWithRelations } from "@/services/artists.service";
import type { TrackWithRelations } from "@/types/database";

export async function ArtistDetail({ slug }: { slug: string }) {
  const artistData = await getArtistWithRelations(slug);
  if (!artistData) return null;

  const photoUrl = getArtistImageUrl(artistData.name, artistData.image_url);
  const tracksWithArtist: TrackWithRelations[] = (artistData.tracks ?? []).map(
    (track) => ({ ...track, artist: artistData })
  );
  const bioProductions = parseProductionsFromBio(artistData.biography ?? "");
  const jsonLd = personJsonLd(artistData);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-makina-pink/15 via-background to-makina-purple/10" />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 md:flex-row md:items-end md:py-14 lg:px-8">
          <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-2xl ring-4 ring-makina-pink/30 shadow-2xl shadow-makina-pink/20 md:h-64 md:w-64">
            <Image
              src={photoUrl}
              alt={`Foto de ${artistData.name}`}
              fill
              className="object-cover"
              sizes="256px"
              priority
              unoptimized={!artistData.image_url}
            />
          </div>
          <div className="flex-1 pb-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-makina-pink">
              Artista
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
              {artistData.name}
            </h1>
            {artistData.real_name && (
              <p className="mt-1 text-muted-foreground">{artistData.real_name}</p>
            )}
            <ArtistMetaChips
              city={artistData.city}
              country={artistData.country}
              tracks={tracksWithArtist}
            />
            <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
              {artistData.instagram_url && (
                <a
                  href={artistData.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-2.5 hover:bg-secondary/80"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {artistData.youtube_url && (
                <a
                  href={artistData.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-2.5 hover:bg-secondary/80"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {artistData.spotify_url && (
                <a
                  href={artistData.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary px-4 py-2 text-xs font-medium hover:bg-secondary/80"
                >
                  Spotify
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <ArtistListenNow
          artistName={artistData.name}
          tracks={tracksWithArtist}
          sessions={artistData.sessions ?? []}
        />

        <section className="mt-10">
          <SectionHeader title="Biografía" />
          <ArtistBio biography={artistData.biography ?? ""} />
        </section>

        {tracksWithArtist.length > 0 ? (
          <section className="mt-12">
            <SectionHeader
              title="Producciones"
              badge={String(tracksWithArtist.length)}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracksWithArtist.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </section>
        ) : bioProductions.length > 0 ? (
          <section className="mt-12">
            <SectionHeader title="Producciones conocidas" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {bioProductions.map((title) => (
                <li
                  key={title}
                  className="glass-card flex items-center gap-3 px-4 py-3"
                >
                  <Music2 className="h-4 w-4 shrink-0 text-makina-pink" />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {artistData.sessions && artistData.sessions.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="Sesiones" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artistData.sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={{ ...session, artist: artistData }}
                />
              ))}
            </div>
          </section>
        )}

        {artistData.events && artistData.events.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="Eventos relacionados" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artistData.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
