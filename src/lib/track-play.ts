import { CURATED_TRACK_WATCH_BY_SLUG } from "@/data/curated-track-youtube";
import {
  sessionYoutubeHref,
  youtubeVideoId,
  youtubeWatchUrl,
} from "@/lib/youtube";

export function resolveTrackPlay(track: {
  slug: string;
  youtube_url: string | null;
}): {
  videoId: string | null;
  youtubeHref: string | null;
  watchUrl: string | null;
  isSearch: boolean;
} {
  let href = sessionYoutubeHref(track.youtube_url);
  let videoId = youtubeVideoId(href);

  if (!videoId) {
    const curated = CURATED_TRACK_WATCH_BY_SLUG[track.slug];
    if (curated) {
      href = curated;
      videoId = youtubeVideoId(curated);
    }
  }

  return {
    videoId,
    youtubeHref: href,
    watchUrl: videoId ? youtubeWatchUrl(videoId) : href,
    isSearch: Boolean(href && !videoId),
  };
}
