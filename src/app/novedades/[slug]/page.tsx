import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Music2, ShoppingBag } from "lucide-react";
import { TrackPlayerSection } from "@/components/media/track-player-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";
import { resolveReleasePreview } from "@/lib/release-play";
import { getNewReleaseBySlug } from "@/services/releases.service";
import { formatGenre } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const release = await getNewReleaseBySlug(slug);
  if (!release) return {};
  return buildMetadata({
    title: `${release.title} — ${release.artist?.name ?? "Mákina"}`,
    description: `Nueva producción ${formatGenre(release.genre)}. Compra en ${release.store_name}.`,
    path: `/novedades/${slug}`,
  });
}

export default async function ReleaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const release = await getNewReleaseBySlug(slug);
  if (!release) notFound();

  const { videoId, watchUrl } = resolveReleasePreview(release);
  const buyLabel = `Comprar en ${release.store_name}`;

  return (
    <article className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="glass-card overflow-hidden">
          {videoId && (
            <div className="border-b border-white/10 p-4 sm:p-6">
              <TrackPlayerSection
                videoId={videoId}
                title={release.title}
                subtitle={release.artist?.name ?? "Preview"}
                artworkUrl={release.cover_url}
                watchUrl={watchUrl}
                badge="Preview"
              />
            </div>
          )}
          <div className="relative aspect-[2/1] bg-gradient-to-br from-makina-pink/30 via-makina-purple/20 to-makina-cyan/10 sm:aspect-[21/9]">
            {release.cover_url ? (
              <Image
                src={release.cover_url}
                alt={release.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Music2 className="h-20 w-20 text-makina-pink/50" />
              </div>
            )}
          </div>
          <div className="p-8">
            <p className="text-sm font-medium text-makina-cyan">
              Lanzamiento · {formatReleaseDate(release.release_date)}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold">{release.title}</h1>
            {release.artist && (
              <Link
                href={`/artistas/${release.artist.slug}`}
                className="mt-2 block text-lg text-makina-pink hover:underline"
              >
                {release.artist.name}
              </Link>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="genre">{formatGenre(release.genre)}</Badge>
              <Badge className="bg-makina-pink/20 text-makina-pink">Nuevo</Badge>
            </div>
            {release.description && (
              <p className="mt-4 text-muted-foreground">{release.description}</p>
            )}
            {release.label && (
              <p className="mt-4 text-sm text-muted-foreground">
                Sello:{" "}
                <Link
                  href={`/sellos/${release.label.slug}`}
                  className="text-foreground hover:underline"
                >
                  {release.label.name}
                </Link>
              </p>
            )}

            <div className="mt-8">
              <a
                href={release.purchase_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto"
              >
                <Button variant="makina" size="lg" className="w-full gap-2 sm:w-auto">
                  <ShoppingBag className="h-5 w-5" />
                  {buyLabel}
                  <ExternalLink className="h-4 w-4 opacity-80" />
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              El enlace de compra te lleva a {release.store_name}. Makina Hub no gestiona pagos.
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/novedades" className="text-makina-pink hover:underline">
            ← Todas las nuevas producciones
          </Link>
        </p>
      </div>
    </article>
  );
}
