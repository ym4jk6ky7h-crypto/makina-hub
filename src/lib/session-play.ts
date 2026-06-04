import { CURATED_SESSION_WATCH_BY_SLUG } from "@/data/curated-session-youtube";
import {
  sessionYoutubeHref,
  youtubeVideoId,
  youtubeWatchUrl,
} from "@/lib/youtube";

export function resolveSessionPlay(session: {
  slug: string;
  youtube_url: string | null;
}): {
  videoId: string | null;
  youtubeHref: string | null;
  watchUrl: string | null;
  isSearch: boolean;
} {
  let href = sessionYoutubeHref(session.youtube_url);
  let videoId = youtubeVideoId(href);

  if (!videoId) {
    const curated = CURATED_SESSION_WATCH_BY_SLUG[session.slug];
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
