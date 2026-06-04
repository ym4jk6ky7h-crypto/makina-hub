import Image from "next/image";
import Link from "next/link";
import { Clock, Play, Youtube } from "lucide-react";
import { MakinaPlaceholder } from "@/components/ui/makina-placeholder";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { TrackWithRelations } from "@/types/database";
import { getTrackArtworkUrl } from "@/lib/track-artwork";
import { resolveTrackPlay } from "@/lib/track-play";
import { Badge } from "@/components/ui/badge";
import { formatGenre, cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/youtube";

type TrackCardProps = {
  track: TrackWithRelations;
};

export async function TrackCard({ track }: TrackCardProps) {
  const { videoId, youtubeHref, isSearch } = resolveTrackPlay(track);
  const artwork =
    (await getTrackArtworkUrl(track.artist?.name ?? "", track.title)) ?? null;
  const thumb =
    youtubeThumbnail(track.youtube_url) ??
    (videoId ? youtubeThumbnail(`https://www.youtube.com/watch?v=${videoId}`) : null) ??
    artwork;

  const detailHref = `/musica/${track.slug}`;

  return (
    <MediaCardShell>
      <Link
        href={detailHref}
        className="relative block aspect-square w-full overflow-hidden bg-gradient-to-br from-makina-purple/30 to-makina-pink/20 sm:aspect-video"
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
            unoptimized={!videoId && Boolean(artwork)}
          />
        ) : (
          <MakinaPlaceholder aspect="square" fill className="sm:aspect-video" />
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
        </div>
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
          {youtubeHref && (
            <span className="flex items-center gap-1 text-red-400">
              <Youtube className="h-3 w-3" />
              {videoId ? "Reproductor" : isSearch ? "Buscar" : "YouTube"}
            </span>
          )}
        </div>

        <Link
          href={detailHref}
          className={cn(
            "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white",
            "transition-colors sm:w-auto",
            videoId ? "bg-red-600 hover:bg-red-500" : "border border-white/15 text-foreground hover:bg-white/5"
          )}
        >
          <Play className={cn("h-4 w-4", videoId && "fill-white")} />
          {videoId ? "Escuchar aquí" : "Ver tema"}
        </Link>
      </div>
    </MediaCardShell>
  );
}
