import Image from "next/image";
import Link from "next/link";
import { Play, Music2 } from "lucide-react";
import type { TrackWithRelations } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { formatGenre } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";

type TrackCardProps = {
  track: TrackWithRelations;
};

export function TrackCard({ track }: TrackCardProps) {
  const thumb = youtubeThumbnail(track.youtube_url);

  return (
    <Link
      href={`/musica/${track.slug}`}
      className="group glass-card-hover flex items-center gap-4 p-4"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-makina-pink/30 to-makina-purple/30">
        {thumb ? (
          <Image
            src={thumb}
            alt={track.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="h-5 w-5 text-makina-pink" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{track.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {track.artist?.name ?? "Artista desconocido"}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge variant="genre" className="text-[10px]">
            {formatGenre(track.genre)}
          </Badge>
          {track.bpm && (
            <span className="text-xs text-muted-foreground">{track.bpm} BPM</span>
          )}
          {track.year && (
            <span className="text-xs text-muted-foreground">{track.year}</span>
          )}
        </div>
      </div>
      {track.youtube_url && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 opacity-60 transition-opacity group-hover:opacity-100">
          <Play className="h-4 w-4 fill-primary text-primary" />
        </div>
      )}
    </Link>
  );
}
