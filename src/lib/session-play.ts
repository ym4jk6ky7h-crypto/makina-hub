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
  durationSeconds: number | null;
  durationMinutes: number | null;
} {
  const curatedWatch = CURATED_SESSION_WATCH_BY_SLUG[session.slug];
  const curatedSeconds = CURATED_SESSION_DURATION_SEC_BY_SLUG[session.slug] ?? null;

  let href = sessionYoutubeHref(session.youtube_url);
  let videoId = youtubeVideoId(href);

  // Vídeo curado = fuente validada (≥15 min) con duración real de YouTube
  if (curatedWatch) {
    href = curatedWatch;
    videoId = youtubeVideoId(curatedWatch);
  }

  let durationSeconds: number | null = curatedSeconds;

  if (durationSeconds == null && session.duration != null && session.duration >= 15) {
    durationSeconds = session.duration * 60;
  }

  if (videoId && durationSeconds != null && !isValidSessionDuration(durationSeconds)) {
    videoId = null;
    href = null;
    durationSeconds = null;
  }

  const durationMinutes: number | null =
    durationSeconds != null ? secondsToMinutes(durationSeconds) : null;

  return {
    videoId,
    youtubeHref: href,
    watchUrl: videoId ? youtubeWatchUrl(videoId) : href,
    isSearch: Boolean(href && !videoId),
    durationSeconds,
    durationMinutes,
  };
}
