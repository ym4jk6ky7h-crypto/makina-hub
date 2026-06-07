import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Music2 } from "lucide-react";
import { TrackCard } from "@/components/cards/track-card";
import { DetailSaveShare } from "@/components/favorites/detail-save-share";
import { TrackDetailPlayer } from "@/components/music/track-detail-player";
import { TrackPlayButton } from "@/components/music/track-play-button";
import { favoriteFromTrack } from "@/lib/favorites/build-item";
import { resolveTrackPlayback } from "@/lib/track-audio";
import { buildQueueFromTracks, trackToQueueItem } from "@/lib/track-queue";
import { buildMetadata } from "@/lib/seo/metadata";
import { musicRecordingJsonLd } from "@/lib/seo/json-ld";
import { getTrackBySlug } from "@/services/tracks.service";
import { formatGenre } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);
  if (!track) return {};
  return buildMetadata({
    title: `${track.title} — ${track.artist?.name}`,
    description: `Tema ${formatGenre(track.genre)}${track.year ? ` (${track.year})` : ""}. ${track.bpm ? `${track.bpm} BPM.` : ""}`,
    path: `/musica/${slug}`,
  });
}

export default async function TrackDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);
  if (!track) notFound();

  const jsonLd = musicRecordingJsonLd({
    title: track.title,
    slug: track.slug,
    year: track.year,
    artistName: track.artist?.name ?? "Desconocido",
  });

  const playback = resolveTrackPlayback(track);
  const artwork = playback.artworkUrl;
  const queueItem = trackToQueueItem(track);
  const similarPlayable = buildQueueFromTracks(track.similar ?? []);
  const queue = queueItem
    ? [queueItem, ...similarPlayable.filter((t) => t.id !== track.id)]
    : [];

  return (
    <article className="px-4 py-8 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="glass-card p-8">
          {queueItem ? (
            <TrackDetailPlayer
              track={queueItem}
              queue={queue}
              title={track.title}
              subtitle={track.artist?.name}
              artworkUrl={artwork}
              downloadUrl={playback.downloadUrl}
              watchUrl={playback.watchUrl}
            />
          ) : artwork ? (
            <div className="relative mb-6 aspect-square w-full max-w-sm overflow-hidden rounded-xl bg-secondary sm:aspect-video sm:max-w-md">
              <Image
                src={artwork}
                alt={track.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
                unoptimized
              />
            </div>
          ) : (
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-makina-pink/30 to-makina-purple/30">
              <Music2 className="h-10 w-10 text-makina-pink" />
            </div>
          )}

          <h1 className="mt-6 text-3xl font-bold">{track.title}</h1>
          {track.artist && (
            <Link
              href={`/artistas/${track.artist.slug}`}
              className="mt-2 block text-lg text-makina-pink hover:underline"
            >
              {track.artist.name}
            </Link>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="genre">{formatGenre(track.genre)}</Badge>
            {track.year && <Badge variant="secondary">{track.year}</Badge>}
            {track.bpm && <Badge variant="outline">{track.bpm} BPM</Badge>}
            {playback.source === "youtube" && (
              <Badge className="bg-red-600/20 text-red-400">YouTube verificado</Badge>
            )}
          </div>
          {track.description && (
            <p className="mt-4 text-sm text-muted-foreground">{track.description}</p>
          )}
          {track.label && (
            <p className="mt-4 text-sm text-muted-foreground">
              Sello:{" "}
              <Link
                href={`/sellos/${track.label.slug}`}
                className="text-foreground hover:underline"
              >
                {track.label.name}
              </Link>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {queueItem && (
              <TrackPlayButton track={queueItem} queue={queue} label="Reproducir" />
            )}
            {playback.downloadUrl && (
              <Button variant="outline" asChild className="gap-2">
                <a
                  href={playback.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Descargar / comprar
                </a>
              </Button>
            )}
          </div>

          {!queueItem && (
            <p className="mt-4 text-sm text-muted-foreground">
              Este tema aún no tiene audio completo verificado en el catálogo. Solo
              reproducimos temas mákina con fuente confirmada (YouTube curado o MP3
              alojado).
            </p>
          )}

          <DetailSaveShare
            item={favoriteFromTrack(track)}
            shareTitle={`${track.title}${track.artist ? ` — ${track.artist.name}` : ""}`}
            sharePath={`/musica/${track.slug}`}
          />
        </div>

        {track.similar && track.similar.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">Canciones similares</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {track.similar.map((t) => (
                <TrackCard key={t.id} track={t} queue={queue} />
              ))}
            </div>
          </section>
        )}

        <Link
          href="/musica"
          className="mt-8 inline-block text-sm text-makina-pink hover:underline"
        >
          ← Volver a música
        </Link>
      </div>
    </article>
  );
}
