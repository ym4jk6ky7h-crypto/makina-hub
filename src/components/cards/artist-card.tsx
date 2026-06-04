import Image from "next/image";
import Link from "next/link";
import { MapPin, Mic2 } from "lucide-react";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { Artist } from "@/types/database";
import { cn } from "@/lib/utils";

type ArtistCardProps = {
  artist: Artist;
  variant?: "grid" | "row";
};

export function ArtistCard({ artist, variant = "grid" }: ArtistCardProps) {
  const photoUrl = getArtistImageUrl(artist.name, artist.image_url);
  const bioPreview = (artist.biography ?? "")
    .replace(/\*\*[^*]+\*\*/g, "")
    .slice(0, 120);

  if (variant === "row") {
    return (
      <Link
        href={`/artistas/${artist.slug}`}
        className="group glass-card-hover flex items-center gap-4 p-4"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/10">
          <Image
            src={photoUrl}
            alt={artist.name}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized={!artist.image_url}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold group-hover:text-makina-pink">{artist.name}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {bioPreview}
            {(artist.biography?.length ?? 0) > 120 ? "…" : ""}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <MediaCardShell>
      <Link
        href={`/artistas/${artist.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-makina-purple/30 to-makina-pink/20"
      >
        <Image
          src={photoUrl}
          alt={`Foto de ${artist.name}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 240px"
          unoptimized={!artist.image_url}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-makina-pink">
            <Mic2 className="h-3.5 w-3.5" />
            Artista
          </div>
          <h3 className="font-display text-lg font-bold leading-tight text-white">
            {artist.name}
          </h3>
          {artist.city && (
            <p className="mt-1 flex items-center gap-1 text-xs text-white/75">
              <MapPin className="h-3 w-3" />
              {artist.city}
            </p>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link
          href={`/artistas/${artist.slug}`}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-lg border border-white/15 px-3 py-2.5 text-sm font-medium",
            "text-foreground transition-colors hover:border-makina-pink/40 hover:bg-white/5"
          )}
        >
          Ver ficha
        </Link>
      </div>
    </MediaCardShell>
  );
}
