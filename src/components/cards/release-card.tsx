import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Music2, ShoppingBag } from "lucide-react";
import type { NewReleaseWithRelations } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatGenre } from "@/lib/utils";

type ReleaseCardProps = {
  release: NewReleaseWithRelations;
  variant?: "grid" | "featured";
};

function formatReleaseDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReleaseCard({ release, variant = "grid" }: ReleaseCardProps) {
  const buyLabel = `Comprar en ${release.store_name}`;

  if (variant === "featured") {
    return (
      <article className="glass-card-hover overflow-hidden">
        <div className="relative aspect-square bg-gradient-to-br from-makina-pink/30 via-makina-purple/20 to-makina-cyan/10">
          {release.cover_url ? (
            <Image
              src={release.cover_url}
              alt={release.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Music2 className="h-16 w-16 text-makina-pink/50" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge className="bg-makina-pink/90 text-white">Nuevo</Badge>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-makina-cyan">
            {formatReleaseDate(release.release_date)}
          </p>
          <Link href={`/novedades/${release.slug}`}>
            <h3 className="mt-1 font-display text-xl font-bold hover:text-makina-pink">
              {release.title}
            </h3>
          </Link>
          {release.artist && (
            <Link
              href={`/artistas/${release.artist.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {release.artist.name}
            </Link>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="genre">{formatGenre(release.genre)}</Badge>
          </div>
          {release.description && (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {release.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={release.purchase_url} target="_blank" rel="noopener noreferrer">
              <Button variant="makina" size="sm" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                {buyLabel}
              </Button>
            </a>
            <Link href={`/novedades/${release.slug}`}>
              <Button size="sm" variant="outline">
                Detalles
              </Button>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="glass-card-hover flex flex-col overflow-hidden sm:flex-row">
      <Link
        href={`/novedades/${release.slug}`}
        className="relative aspect-square w-full shrink-0 bg-gradient-to-br from-makina-pink/25 to-makina-purple/25 sm:w-36"
      >
        {release.cover_url ? (
          <Image
            src={release.cover_url}
            alt={release.title}
            fill
            className="object-cover"
            sizes="144px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Music2 className="h-10 w-10 text-makina-pink/60" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-xs text-makina-cyan">{formatReleaseDate(release.release_date)}</p>
          <Link href={`/novedades/${release.slug}`}>
            <h3 className="font-display text-lg font-bold hover:text-makina-pink">
              {release.title}
            </h3>
          </Link>
          {release.artist && (
            <Link
              href={`/artistas/${release.artist.slug}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {release.artist.name}
            </Link>
          )}
          {release.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {release.description}
            </p>
          )}
        </div>
        <a
          href={release.purchase_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex"
        >
          <Button variant="makina" size="sm" className="w-full gap-2 sm:w-auto">
            <ExternalLink className="h-4 w-4" />
            {buyLabel}
          </Button>
        </a>
      </div>
    </article>
  );
}
