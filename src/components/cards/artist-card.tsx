import Image from "next/image";
import Link from "next/link";
import { MapPin, Mic2 } from "lucide-react";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { Artist } from "@/types/database";

type ArtistCardProps = {
  artist: Artist;
  variant?: "grid" | "row";
};

export function ArtistCard({ artist, variant = "grid" }: ArtistCardProps) {
  const photoUrl = getArtistImageUrl(artist.name, artist.image_url, artist.slug);
  const bioPreview = (artist.biography ?? "")
    .replace(/\*\*[^*]+\*\*/g, "")
    .slice(0, 120);
  const detailHref = `/artistas/${artist.slug}`;

  if (variant === "row") {
    return (
      <Link
        href={detailHref}
        className="group card-lift glass-card-hover flex items-center gap-4 border-makina-pink/10 p-4"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-makina-pink/30 transition-all group-hover:ring-makina-pink group-hover:shadow-makina-glow-sm">
          <Image
            src={photoUrl}
            alt={artist.name}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized={preferUnoptimizedImage(photoUrl)}
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
    <MediaCardShell accent="artist" className="card-lift">
      <Link
        href={detailHref}
        className="relative flex flex-col items-center px-4 pb-5 pt-6"
      >
        <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-makina-pink/25 shadow-lg shadow-makina-pink/20 transition-all duration-300 group-hover:ring-makina-pink group-hover:shadow-makina-glow sm:h-36 sm:w-36">
          <Image
            src={photoUrl}
            alt={`Foto de ${artist.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="144px"
            unoptimized={preferUnoptimizedImage(photoUrl)}
          />
        </div>
        <div className="mt-4 w-full text-center">
          <div className="mb-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-makina-pink">
            <Mic2 className="h-3 w-3" />
            DJ
          </div>
          <h3 className="font-display text-lg font-bold leading-tight group-hover:text-makina-pink">
            {artist.name}
          </h3>
          {artist.city && (
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {artist.city}
            </p>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-makina-pink/[0.06] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    </MediaCardShell>
  );
}
