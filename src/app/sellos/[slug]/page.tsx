import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscAlbum, ExternalLink, MapPin, Music2 } from "lucide-react";
import { ReleaseCard } from "@/components/cards/release-card";
import { ArtistCard } from "@/components/cards/artist-card";
import { Badge } from "@/components/ui/badge";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLabelBySlug } from "@/services/labels.service";

type PageProps = { params: Promise<{ slug: string }> };

function labelLogoUrl(name: string, logoUrl?: string | null): string {
  if (logoUrl?.trim()) return logoUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=512&background=1a1020&color=e8b84a&bold=true&format=png`;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const label = await getLabelBySlug(slug);
  if (!label) return {};
  return buildMetadata({
    title: `${label.name} — sello mákina`,
    description: (label.history ?? label.description).slice(0, 160),
    path: `/sellos/${slug}`,
  });
}

export default async function SelloDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const label = await getLabelBySlug(slug);
  if (!label) notFound();

  const logo = labelLogoUrl(label.name, label.logo_url);
  const history = label.history ?? label.description;

  return (
    <article>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-makina-gold/15 via-background to-makina-purple/10" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 md:flex-row md:items-end md:py-14 lg:px-8">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-secondary ring-4 ring-makina-gold/30 md:h-48 md:w-48">
            <Image
              src={logo}
              alt={`Logo ${label.name}`}
              fill
              className="object-contain p-4"
              sizes="192px"
              priority
              unoptimized={preferUnoptimizedImage(logo)}
            />
          </div>
          <div className="flex-1 pb-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-makina-gold">
              Sello discográfico
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
              {label.name}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {label.founded_year && (
                <Badge variant="secondary">Fundado en {label.founded_year}</Badge>
              )}
              {label.city && (
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {label.city}
                </Badge>
              )}
              <Badge variant="genre">Mákina · Remember</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <section className="glass-card p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <DiscAlbum className="h-5 w-5 text-makina-gold" />
            Historia
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{history}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{label.description}</p>
        </section>

        {label.classics && label.classics.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-xl font-bold">Clásicos del sello</h2>
            <div className="flex flex-wrap gap-2">
              {label.classics.map((classic) => (
                <Badge key={classic} className="bg-makina-gold/15 text-makina-gold">
                  {classic}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {label.artists && label.artists.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 font-display text-xl font-bold">Artistas del sello</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {label.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>
        )}

        {label.releases && label.releases.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 font-display text-xl font-bold">Novedades en tienda</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {label.releases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </div>
          </section>
        )}

        {(!label.artists || label.artists.length === 0) &&
          (!label.releases || label.releases.length === 0) && (
            <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <Music2 className="mx-auto h-10 w-10 text-makina-gold/60" />
              <p className="mt-3 text-sm text-muted-foreground">
                Explora artistas y novedades relacionadas con {label.name} en el resto de la web.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/artistas"
                  className="inline-flex items-center gap-1 text-sm font-medium text-makina-pink hover:underline"
                >
                  Ver artistas
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/novedades"
                  className="inline-flex items-center gap-1 text-sm font-medium text-makina-pink hover:underline"
                >
                  Ver novedades
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          )}

        <Link
          href="/sellos"
          className="mt-10 inline-block text-sm text-makina-pink hover:underline"
        >
          ← Todos los sellos
        </Link>
      </div>
    </article>
  );
}
