import {
  CURATED_SESSION_DURATION_SEC_BY_SLUG,
  CURATED_SESSION_WATCH_BY_SLUG,
} from "@/data/curated-session-youtube";
import {
  isValidSessionDuration,
  secondsToMinutes,
} from "@/lib/youtube-duration";
import {
  sessionYoutubeHref,
  youtubeVideoId,
  youtubeWatchUrl,
} from "@/lib/youtube";

export function resolveSessionPlay(session: {
  slug: string;
  youtube_url: string | null;
  duration?: number | null;
}): {
  videoId: string | null;
  youtubeHref: string | null;
  watchUrl: string | null;
  isSearch: boolean;
  durationMinutes: number | null;
} {
  let href = sessionYoutubeHref(session.youtube_url);
  let videoId = youtubeVideoId(href);
  let durationSeconds: number | null =
    CURATED_SESSION_DURATION_SEC_BY_SLUG[session.slug] ?? null;

  if (!videoId) {
    const curated = CURATED_SESSION_WATCH_BY_SLUG[session.slug];
    if (curated) {
      href = curated;
      videoId = youtubeVideoId(curated);
    }
  }

  if (durationSeconds == null && session.duration != null && session.duration >= 15) {
    durationSeconds = session.duration * 60;
  }

  if (videoId && durationSeconds != null && !isValidSessionDuration(durationSeconds)) {
    videoId = null;
    href = null;
  }

  const durationMinutes: number | null =
    durationSeconds != null
      ? secondsToMinutes(durationSeconds)
      : (session.duration ?? null);

  return {
    videoId,
    youtubeHref: href,
    watchUrl: videoId ? youtubeWatchUrl(videoId) : href,
    isSearch: Boolean(href && !videoId),
    durationMinutes,
  };
}
