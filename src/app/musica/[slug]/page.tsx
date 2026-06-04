import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Music2 } from "lucide-react";
import { TrackCard } from "@/components/cards/track-card";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";
import { musicRecordingJsonLd } from "@/lib/seo/json-ld";
import { getTrackBySlug } from "@/services/tracks.service";
import { formatGenre } from "@/lib/utils";

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

  return (
    <article className="px-4 py-8 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="glass-card p-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-makina-pink/30 to-makina-purple/30">
            <Music2 className="h-10 w-10 text-makina-pink" />
          </div>
          <h1 className="text-3xl font-bold">{track.title}</h1>
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
          {track.youtube_url && (
            <a
              href={track.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30"
            >
              <ExternalLink className="h-4 w-4" />
              Ver en YouTube
            </a>
          )}
        </div>

        {track.similar && track.similar.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">Canciones similares</h2>
            <div className="grid gap-3">
              {track.similar.map((t) => (
                <TrackCard key={t.id} track={t} />
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
