import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackCard } from "@/components/cards/track-card";
import { ArtistCard } from "@/components/cards/artist-card";
import { VinylCard } from "@/components/cards/vinyl-card";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLabelBySlug } from "@/services/labels.service";
import type { TrackWithRelations, VinylWithRelations } from "@/types/database";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const label = await getLabelBySlug(slug);
  if (!label) return {};
  return buildMetadata({
    title: label.name,
    description: label.description.slice(0, 160),
    path: `/sellos/${slug}`,
  });
}

export default async function SelloDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const label = await getLabelBySlug(slug);
  if (!label) notFound();

  const tracks = (label.tracks ?? []) as TrackWithRelations[];
  const vinyls = (label.vinyls ?? []) as VinylWithRelations[];

  return (
    <article className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold lg:text-4xl">{label.name}</h1>
        {label.founded_year && (
          <p className="mt-2 text-muted-foreground">
            Fundado en {label.founded_year}
          </p>
        )}
        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          {label.description}
        </p>

        {tracks.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">Lanzamientos</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </section>
        )}

        {vinyls.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">Vinilos</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {vinyls.map((vinyl) => (
                <VinylCard key={vinyl.id} vinyl={vinyl} />
              ))}
            </div>
          </section>
        )}

        {label.artists && label.artists.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">Artistas</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {label.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>
        )}

        <Link
          href="/sellos"
          className="mt-8 inline-block text-sm text-makina-pink hover:underline"
        >
          ← Volver a sellos
        </Link>
      </div>
    </article>
  );
}
