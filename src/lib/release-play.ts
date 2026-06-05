import { youtubeVideoId, youtubeWatchUrl, sessionYoutubeHref } from "@/lib/youtube";

export function resolveReleasePreview(release: {
  youtube_url: string | null;
}): {
  videoId: string | null;
  watchUrl: string | null;
} {
  const href = sessionYoutubeHref(release.youtube_url);
  const videoId = youtubeVideoId(href);
  return {
    videoId,
    watchUrl: videoId ? youtubeWatchUrl(videoId) : href,
  };
}
