import Image from "next/image";
import Link from "next/link";
import type { Artist } from "@/types/database";
import { getArtistImageUrl } from "@/lib/artists/artist-image";

type ArtistCardProps = {
  artist: Artist;
  variant?: "grid" | "row";
};

export function ArtistCard({ artist, variant = "grid" }: ArtistCardProps) {
  const photoUrl = getArtistImageUrl(artist.name, artist.image_url);

  if (variant === "row") {
    return (
      <Link
        href={`/artistas/${artist.slug}`}
        className="group glass-card-hover flex items-center gap-4 p-4"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
          <Image
            src={photoUrl}
            alt={artist.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{artist.name}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {artist.biography.replace(/\*\*[^*]+\*\*\s*/g, "").slice(0, 120)}
            {artist.biography.length > 120 ? "…" : ""}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/artistas/${artist.slug}`}
      className="group glass-card-hover flex flex-col items-center p-6 text-center"
    >
      <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/10 transition-all group-hover:ring-makina-pink/50">
        <Image
          src={photoUrl}
          alt={`Foto de ${artist.name}`}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <h3 className="font-semibold">{artist.name}</h3>
      {artist.city && (
        <p className="mt-1 text-xs text-muted-foreground">{artist.city}</p>
      )}
    </Link>
  );
}
