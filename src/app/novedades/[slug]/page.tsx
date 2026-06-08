import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Music2, ShoppingBag } from "lucide-react";
import { DetailSaveShare } from "@/components/favorites/detail-save-share";
import { ReleasePreviewSection } from "@/components/media/release-preview-section";
import { favoriteFromRelease } from "@/lib/favorites/build-item";
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
    <article>
      <section className="detail-hero-glow relative overflow-hidden border-b border-makina-gold/20">
        {release.cover_url && (
          <div className="absolute inset-0">
            <Image
              src={release.cover_url}
              alt=""
              fill
              className="scale-110 object-cover opacity-25 blur-3xl"
              sizes="100vw"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/95 to-background" />

        <div className="relative mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr] lg:items-center lg:gap-12 lg:px-8 lg:py-14">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl shadow-2xl shadow-black/50 ring-1 ring-makina-gold/30">
            {release.cover_url ? (
              <Image
                src={release.cover_url}
                alt={release.title}
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-makina-gold/10">
                <Music2 className="h-20 w-20 text-makina-gold/50" />
              </div>
            )}
          </div>
          <div className="text-center lg:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-makina-gold">
              Novedad · {formatReleaseDate(release.release_date)}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              {release.title}
            </h1>
            {release.artist && (
              <Link
                href={`/artistas/${release.artist.slug}`}
                className="mt-3 inline-block text-lg text-makina-pink hover:underline"
              >
                {release.artist.name}
              </Link>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
              <Badge variant="genre">{formatGenre(release.genre)}</Badge>
              <Badge className="border-0 bg-makina-gold/90 text-black">Nuevo</Badge>
            </div>
            <a
              href={release.purchase_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-makina-gold to-makina-pink text-black hover:opacity-90 sm:w-auto"
              >
                <ShoppingBag className="h-5 w-5" />
                {buyLabel}
                <ExternalLink className="h-4 w-4 opacity-80" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        {videoId && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-white/10">
            <ReleasePreviewSection
              videoId={videoId}
              title={release.title}
              subtitle={release.artist?.name ?? "Preview"}
              artworkUrl={release.cover_url}
              watchUrl={watchUrl}
              badge="Preview"
            />
          </div>
        )}

        <div className="glass-card p-6 sm:p-8">
          {release.description && (
            <p className="leading-relaxed text-muted-foreground">{release.description}</p>
          )}
          {release.label && (
            <p className={`text-sm text-muted-foreground ${release.description ? "mt-4" : ""}`}>
              Sello:{" "}
              <Link
                href={`/sellos/${release.label.slug}`}
                className="text-foreground hover:underline"
              >
                {release.label.name}
              </Link>
            </p>
          )}
          <DetailSaveShare
            item={favoriteFromRelease(release)}
            shareTitle={`${release.title}${release.artist ? ` — ${release.artist.name}` : ""}`}
            sharePath={`/novedades/${release.slug}`}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            El enlace de compra te lleva a {release.store_name}. Makina Hub no gestiona pagos.
          </p>
        </div>

        <Link
          href="/novedades"
          className="mt-10 inline-block text-sm font-medium text-makina-gold hover:underline"
        >
          ← Todas las novedades
        </Link>
      </div>
    </article>
  );
}
