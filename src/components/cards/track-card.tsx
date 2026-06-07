import Link from "next/link";
import { Clock, Download, Disc3, Music2 } from "lucide-react";
import { TrackPlayButton } from "@/components/music/track-play-button";
import { MakinaPlaceholder } from "@/components/ui/makina-placeholder";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { MusicQueueItem } from "@/lib/music-player-types";
import { resolveTrackAudio } from "@/lib/track-audio";
import { trackToQueueItem } from "@/lib/track-queue";
import type { TrackWithRelations } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { formatGenre, cn } from "@/lib/utils";

type TrackCardProps = {
  track: TrackWithRelations;
  queue?: MusicQueueItem[];
  variant?: "grid" | "vinyl";
};

export function TrackCard({ track, queue, variant = "vinyl" }: TrackCardProps) {
  const audio = resolveTrackAudio(track);
  const queueItem = trackToQueueItem(track);
  const playQueue = queue ?? (queueItem ? [queueItem] : []);
  const detailHref = `/musica/${track.slug}`;
  const decade = track.year != null && track.year < 2000 ? "classic" : "modern";

  return (
    <MediaCardShell
      className={cn(
        variant === "vinyl" && decade === "classic" && "ring-1 ring-white/5"
      )}
    >
      <Link
        href={detailHref}
        className={cn(
          "relative block w-full overflow-hidden bg-gradient-to-br from-makina-purple/30 to-makina-pink/20",
          variant === "vinyl" ? "aspect-square" : "aspect-square sm:aspect-video"
        )}
      >
        <MakinaPlaceholder
          aspect="square"
          fill
          className={cn(
            "bg-gradient-to-br",
            decade === "classic"
              ? "from-makina-pink/25 via-black/40 to-makina-purple/30"
              : "from-makina-cyan/20 via-black/40 to-makina-purple/25"
          )}
        />
        {variant === "vinyl" && (
          <div className="pointer-events-none absolute inset-4 rounded-full border border-white/10 bg-black/20 shadow-inner" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          {queueItem ? (
            <TrackPlayButton
              track={queueItem}
              queue={playQueue}
              variant="icon"
              className="pointer-events-auto relative z-10"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <Disc3 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        {audio.isPreview && (
          <span className="absolute left-3 top-3 rounded-full bg-makina-cyan/90 px-2 py-0.5 text-[10px] font-bold uppercase text-black">
            Preview
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-2 p-4">
        <Link href={detailHref} className="block min-w-0">
          <h3 className="line-clamp-2 font-semibold leading-snug text-foreground group-hover:text-makina-pink">
            {track.title}
          </h3>
          {track.artist?.name && (
            <p className="mt-1 text-sm text-muted-foreground">{track.artist.name}</p>
          )}
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="genre" className="text-[10px]">
            {formatGenre(track.genre)}
          </Badge>
          {track.bpm != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {track.bpm} BPM
            </span>
          )}
          {track.year != null && <span>{track.year}</span>}
          {queueItem && (
            <span className="flex items-center gap-1 text-makina-pink">
              <Music2 className="h-3 w-3" />
              Audio
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap gap-2">
          {queueItem ? (
            <TrackPlayButton
              track={queueItem}
              queue={playQueue}
              variant="card"
            />
          ) : (
            <Link
              href={detailHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 px-3 py-2.5 text-sm font-medium hover:bg-white/5 sm:w-auto"
            >
              Ver tema
            </Link>
          )}
          {audio.downloadUrl && (
            <a
              href={audio.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-makina-cyan/30 px-3 py-2.5 text-sm font-medium text-makina-cyan hover:bg-makina-cyan/10"
            >
              <Download className="h-4 w-4" />
              Descargar
            </a>
          )}
        </div>
      </div>
    </MediaCardShell>
  );
}
