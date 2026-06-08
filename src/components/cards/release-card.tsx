import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { MakinaPlaceholder } from "@/components/ui/makina-placeholder";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { NewReleaseWithRelations } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { formatGenre, cn } from "@/lib/utils";

type ReleaseCardProps = {
  release: NewReleaseWithRelations;
  variant?: "grid" | "featured";
};

function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReleaseCard({ release, variant = "grid" }: ReleaseCardProps) {
  const buyLabel = `Comprar · ${release.store_name}`;
  const detailHref = `/novedades/${release.slug}`;

  const cover = (
    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-makina-gold/20 to-makina-pink/25">
      {release.cover_url ? (
        <Image
          src={release.cover_url}
          alt={release.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 320px"
        />
      ) : (
        <MakinaPlaceholder aspect="square" fill />
      )}
      <div className="absolute left-3 top-3">
        <Badge className="border-0 bg-makina-gold/90 text-black">Nuevo</Badge>
      </div>
      <div className="absolute bottom-3 right-3">
        <Badge variant="secondary" className="border-white/10 bg-black/50 text-[10px] backdrop-blur-sm">
          {release.store_name}
        </Badge>
      </div>
    </div>
  );

  const body = (
    <div className="flex flex-col gap-2 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-makina-gold">
        {formatReleaseDate(release.release_date)}
      </p>
      <Link href={detailHref}>
        <h3
          className={cn(
            "font-display font-bold leading-tight group-hover:text-makina-gold",
            variant === "featured" ? "text-xl" : "text-base"
          )}
        >
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
      <Badge variant="genre" className="w-fit text-[10px]">
        {formatGenre(release.genre)}
      </Badge>
      {variant === "grid" && (
        <a
          href={release.purchase_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-makina-gold/30 bg-makina-gold/10 px-3 py-2 text-sm font-semibold text-makina-gold transition-colors hover:bg-makina-gold/20"
        >
          <ShoppingBag className="h-4 w-4" />
          {buyLabel}
        </a>
      )}
      {variant === "featured" && release.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{release.description}</p>
      )}
      {variant === "featured" && (
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <a
            href={release.purchase_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-makina-gold to-makina-pink px-3 py-2.5 text-sm font-semibold text-black",
              "transition-opacity hover:opacity-90"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            {buyLabel}
          </a>
          <Link
            href={detailHref}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 py-2.5 text-sm font-medium hover:bg-white/5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Detalles
          </Link>
        </div>
      )}
    </div>
  );

  if (variant === "featured") {
    return (
      <MediaCardShell accent="release" className="card-lift lg:flex-row">
        <Link href={detailHref} className="relative block w-full shrink-0 lg:w-72">
          {cover}
        </Link>
        {body}
      </MediaCardShell>
    );
  }

  return (
    <MediaCardShell accent="release" className="card-lift">
      <Link href={detailHref} className="block">
        {cover}
      </Link>
      {body}
    </MediaCardShell>
  );
}
