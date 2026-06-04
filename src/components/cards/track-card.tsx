import Image from "next/image";
import Link from "next/link";
import { Music2 } from "lucide-react";
import { PlayThumbnailOverlay } from "@/components/ui/play-youtube-button";
import { PlayYoutubeButton } from "@/components/ui/play-youtube-button";
import type { TrackWithRelations } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { formatGenre } from "@/lib/utils";
import { isDirectYoutubeWatch, youtubeThumbnail } from "@/lib/youtube";

type TrackCardProps = {
  track: TrackWithRelations;
};

export function TrackCard({ track }: TrackCardProps) {
  const thumb = youtubeThumbnail(track.youtube_url);
  const hasYoutube = track.youtube_url && isDirectYoutubeWatch(track.youtube_url);

  return (
    <div className="glass-card-hover flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
      <Link
        href={`/musica/${track.slug}`}
        className="group flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-makina-pink/30 to-makina-purple/30 sm:h-16 sm:w-16">
          {thumb ? (
            <>
              <Image
                src={thumb}
                alt={track.title}
                fill
                className="object-cover"
                sizes="64px"
              />
              {hasYoutube && (
                <PlayThumbnailOverlay className="rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100" />
              )}
            </>
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
      </Link>
      {hasYoutube && track.youtube_url && (
        <PlayYoutubeButton
          href={track.youtube_url}
          size="sm"
          label="Escuchar"
          className="hidden sm:inline-flex"
        />
      )}
      {hasYoutube && track.youtube_url && (
        <PlayYoutubeButton
          href={track.youtube_url}
          size="sm"
          label=""
          className="!h-10 !w-10 !p-0 sm:hidden"
        />
      )}
    </div>
  );
}
