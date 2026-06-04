import Image from "next/image";
import { Disc3, Instagram, Music2, Youtube } from "lucide-react";
import { ArtistBio, parseProductionsFromBio } from "@/components/artists/artist-bio";
import { ArtistListenNow } from "@/components/artists/artist-listen-now";
import { ArtistMetaChips } from "@/components/artists/artist-meta-chips";
import { EventCard } from "@/components/cards/event-card";
import { TrackCard } from "@/components/cards/track-card";
import { SessionCard } from "@/components/cards/session-card";
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
  const bioProductions = parseProductionsFromBio(artistData.biography);
  const jsonLd = personJsonLd(artistData);

  return (
    <article className="px-4 py-8 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="relative h-52 w-52 shrink-0 overflow-hidden rounded-2xl ring-4 ring-makina-pink/30 shadow-lg shadow-makina-pink/10">
            <Image
              src={photoUrl}
              alt={`Foto de ${artistData.name}`}
              fill
              className="object-cover"
              sizes="208px"
              priority
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold lg:text-4xl">{artistData.name}</h1>
            {artistData.real_name && (
              <p className="mt-1 text-sm text-muted-foreground">
                {artistData.real_name}
              </p>
            )}
            <ArtistMetaChips
              city={artistData.city}
              country={artistData.country}
              tracks={tracksWithArtist}
            />
            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              {artistData.instagram_url && (
                <a
                  href={artistData.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-2 hover:bg-secondary/80"
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
                  className="rounded-full bg-secondary p-2 hover:bg-secondary/80"
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
                  className="rounded-full bg-secondary px-3 py-2 text-xs font-medium hover:bg-secondary/80"
                >
                  Spotify
                </a>
              )}
            </div>
          </div>
        </header>

        <ArtistListenNow
          artistName={artistData.name}
          tracks={tracksWithArtist}
          sessions={artistData.sessions ?? []}
        />

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Biografía</h2>
          <ArtistBio biography={artistData.biography} />
        </section>

        {tracksWithArtist.length > 0 ? (
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-2">
              <Disc3 className="h-5 w-5 text-makina-pink" />
              <h2 className="text-xl font-bold">Producciones</h2>
              <span className="text-sm text-muted-foreground">
                ({tracksWithArtist.length})
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tracksWithArtist.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </section>
        ) : bioProductions.length > 0 ? (
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-2">
              <Disc3 className="h-5 w-5 text-makina-pink" />
              <h2 className="text-xl font-bold">Producciones conocidas</h2>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
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
            <h2 className="mb-6 text-xl font-bold">Sesiones</h2>
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
            <h2 className="mb-6 text-xl font-bold">Eventos relacionados</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
