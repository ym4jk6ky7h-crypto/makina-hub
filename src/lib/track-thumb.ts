import { resolveTrackPlay } from "@/lib/track-play";
import { youtubeThumbnail } from "@/lib/youtube";
import type { TrackWithRelations } from "@/types/database";

/** Miniatura de tema sin llamadas externas (rápido en listados). */
export function getTrackThumbnailSync(track: TrackWithRelations): string | null {
  const { videoId, watchUrl } = resolveTrackPlay(track);
  return (
    youtubeThumbnail(track.youtube_url) ??
    youtubeThumbnail(watchUrl) ??
    (videoId ? youtubeThumbnail(`https://www.youtube.com/watch?v=${videoId}`) : null)
  );
}
