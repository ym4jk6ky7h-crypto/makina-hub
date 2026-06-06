import { parseIso8601Duration, secondsToMinutes } from "../../src/lib/youtube-duration";
import { youtubeVideoId } from "../../src/lib/youtube";
import { scrapeVideoMeta } from "./youtube-scrape";

async function fetchDurationSecondsApi(
  videoId: string,
  apiKey: string
): Promise<number | null> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    items?: Array<{ contentDetails?: { duration?: string } }>;
  };
  const iso = data.items?.[0]?.contentDetails?.duration;
  if (!iso) return null;
  return parseIso8601Duration(iso);
}

/** Duración real del vídeo de YouTube (segundos). */
export async function fetchVideoDurationSeconds(
  youtubeUrl: string | null | undefined,
  apiKey?: string
): Promise<number | null> {
  const videoId = youtubeVideoId(youtubeUrl ?? "");
  if (!videoId) return null;

  if (apiKey) {
    try {
      const seconds = await fetchDurationSecondsApi(videoId, apiKey);
      if (seconds != null) return seconds;
    } catch {
      /* scrape fallback */
    }
  }

  const meta = scrapeVideoMeta(videoId);
  return meta.durationSeconds;
}

export async function fetchVideoDurationMinutes(
  youtubeUrl: string | null | undefined,
  apiKey?: string
): Promise<number | null> {
  const seconds = await fetchVideoDurationSeconds(youtubeUrl, apiKey);
  return seconds != null ? secondsToMinutes(seconds) : null;
}
