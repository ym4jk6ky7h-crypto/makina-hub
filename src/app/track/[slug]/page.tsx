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
    description: `Track ${formatGenre(track.genre)}`,
    path: `/track/${slug}`,
  });
}

export default async function TrackDetailPageEn({ params }: PageProps) {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);
  if (!track) notFound();

  const jsonLd = musicRecordingJsonLd({
    title: track.title,
    slug: track.slug,
    year: track.year,
    artistName: track.artist?.name ?? "Unknown",
  });

  return (
    <article className="px-4 py-8 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="glass-card p-8">
          <Music2 className="mb-6 h-10 w-10 text-makina-pink" />
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
          {track.youtube_url && (
            <a
              href={track.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-red-400"
            >
              <ExternalLink className="h-4 w-4" />
              YouTube
            </a>
          )}
        </div>
        {track.similar && track.similar.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">Similar tracks</h2>
            <div className="grid gap-3">
              {track.similar.map((t) => (
                <TrackCard key={t.id} track={t} />
              ))}
            </div>
          </section>
        )}
        <Link href="/musica" className="mt-8 inline-block text-sm text-makina-pink hover:underline">
          ← Back to music
        </Link>
      </div>
    </article>
  );
}
