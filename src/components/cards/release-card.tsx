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
    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-makina-pink/25 to-makina-purple/25">
      {release.cover_url ? (
        <Image
          src={release.cover_url}
          alt={release.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 320px"
        />
      ) : (
        <MakinaPlaceholder aspect="square" fill />
      )}
      <div className="absolute left-3 top-3">
        <Badge className="bg-makina-pink/90 text-white">Nuevo</Badge>
      </div>
    </div>
  );

  const body = (
    <div className="flex flex-col gap-2 p-4">
      <p className="text-xs font-medium text-makina-cyan">
        {formatReleaseDate(release.release_date)}
      </p>
      <Link href={detailHref}>
        <h3
          className={cn(
            "font-display font-bold leading-tight hover:text-makina-pink",
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
      {variant === "featured" && release.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{release.description}</p>
      )}
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <a
          href={release.purchase_url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-makina-pink to-makina-purple px-3 py-2.5 text-sm font-semibold text-white",
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
    </div>
  );

  if (variant === "featured") {
    return (
      <MediaCardShell className="lg:flex-row">
        <Link href={detailHref} className="relative block w-full shrink-0 lg:w-72">
          {cover}
        </Link>
        {body}
      </MediaCardShell>
    );
  }

  return (
    <MediaCardShell>
      <Link href={detailHref} className="block">
        {cover}
      </Link>
      {body}
    </MediaCardShell>
  );
}
