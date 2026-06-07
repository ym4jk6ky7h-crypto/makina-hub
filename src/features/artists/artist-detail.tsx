import Image from "next/image";
import { Headphones, Instagram, Youtube } from "lucide-react";
import { DetailSaveShare } from "@/components/favorites/detail-save-share";
import { favoriteFromArtist } from "@/lib/favorites/build-item";
import { ArtistBio } from "@/components/artists/artist-bio";
import { ArtistListenNow } from "@/components/artists/artist-listen-now";
import { ArtistMetaChips } from "@/components/artists/artist-meta-chips";
import { ArtistSectionNav } from "@/components/artists/artist-section-nav";
import { EventCard } from "@/components/cards/event-card";
import { SessionCard } from "@/components/cards/session-card";
import { DetailPlayerSection } from "@/components/media/detail-player-section";
import { SectionHeader } from "@/components/layout/section-header";
import { HomeSectionEmpty } from "@/components/ui/home-section-empty";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { resolveSessionPlay } from "@/lib/session-play";
import { personJsonLd } from "@/lib/seo/json-ld";
import type { Artist, ArtistWithRelations } from "@/types/database";

function pickPrimarySession(
  sessions: { title: string; slug: string; youtube_url: string | null; duration?: number | null }[]
) {
  for (const session of sessions) {
    const { videoId, watchUrl } = resolveSessionPlay(session);
    if (videoId) {
      return {
        videoId,
        title: session.title,
        watchUrl,
        subtitle: "Sesión mákina",
      };
    }
  }
  return null;
}

export async function ArtistDetail({
  artistData,
}: {
  artistData: ArtistWithRelations;
}) {
  const photoUrl = getArtistImageUrl(
    artistData.name,
    artistData.image_url,
    artistData.slug
  );
  const artistRef = {
    id: artistData.id,
    slug: artistData.slug,
    name: artistData.name,
  } as Artist;
  const sessions = (artistData.sessions ?? []).map((session) => ({
    ...session,
    artist: artistRef,
  }));
  const primaryVideo = pickPrimarySession(sessions);
  const jsonLd = personJsonLd(artistData);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
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
              unoptimized
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
              tracks={[]}
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
            <DetailSaveShare
              item={favoriteFromArtist(artistData)}
              shareTitle={artistData.name}
              sharePath={`/artistas/${artistData.slug}`}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <ArtistSectionNav
          hasPlayer={Boolean(primaryVideo)}
          sessionCount={sessions.length}
        />

        {primaryVideo && (
          <section className="mb-10">
            <SectionHeader title="Escuchar" subtitle="Reproductor integrado" />
            <DetailPlayerSection
              videoId={primaryVideo.videoId}
              title={primaryVideo.title}
              watchUrl={primaryVideo.watchUrl}
              subtitle={primaryVideo.subtitle}
            />
          </section>
        )}

        <ArtistListenNow
          artistName={artistData.name}
          sessions={sessions}
          inlinePlayer={Boolean(primaryVideo)}
        />

        <section id="sesiones" className="scroll-mt-28">
          <SectionHeader
            title="Sesiones"
            badge={sessions.length > 0 ? String(sessions.length) : undefined}
          />
          {sessions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <HomeSectionEmpty
              icon={Headphones}
              message="Sin sesión publicada para este DJ."
              actionLabel="Ver sesiones"
              actionHref="/sesiones"
            />
          )}
        </section>

        <section id="bio" className="mt-12 scroll-mt-28">
          <SectionHeader title="Biografía" />
          <ArtistBio biography={artistData.biography ?? ""} />
        </section>

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
