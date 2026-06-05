import {
  MAX_TRACK_SECONDS,
  MIN_SESSION_SECONDS,
  MIN_TRACK_SECONDS,
} from "../../src/lib/media-constants";
import { parseIso8601Duration, secondsToMinutes } from "../../src/lib/youtube-duration";
import { scrapeVideoMeta, searchVideoIds } from "./youtube-scrape";

export type YouTubeResult = {
  channelUrl: string | null;
  videoUrl: string | null;
  searchUrl: string;
};

export type SessionVideoResult = {
  videoUrl: string | null;
  durationMinutes: number | null;
  searchUrl: string;
};

export type TrackVideoResult = {
  videoUrl: string | null;
  searchUrl: string;
};

function artistNameMatches(artistName: string, ytTitle: string): boolean {
  const parts = artistName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
  const tl = ytTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return parts.some((p) => tl.includes(p));
}

async function fetchVideoDurationsApi(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, { seconds: number; publishedAt: string | null }>> {
  const map = new Map<string, { seconds: number; publishedAt: string | null }>();
  if (videoIds.length === 0) return map;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(",")}&key=${apiKey}`
  );
  if (!res.ok) return map;

  const data = (await res.json()) as {
    items?: Array<{
      id?: string;
      contentDetails?: { duration?: string };
      snippet?: { publishedAt?: string; title?: string };
    }>;
  };

  for (const item of data.items ?? []) {
    if (!item.id || !item.contentDetails?.duration) continue;
    const seconds = parseIso8601Duration(item.contentDetails.duration);
    if (seconds == null) continue;
    map.set(item.id, {
      seconds,
      publishedAt: item.snippet?.publishedAt ?? null,
    });
  }
  return map;
}

function pickBestSessionCandidate(
  artistName: string,
  candidates: Array<{ id: string; seconds: number; publishedAt: string | null; title: string | null }>
): { id: string; seconds: number } | null {
  const valid = candidates.filter(
    (c) => c.seconds >= MIN_SESSION_SECONDS && artistNameMatches(artistName, c.title ?? "")
  );
  if (valid.length === 0) {
    const byDuration = candidates.filter((c) => c.seconds >= MIN_SESSION_SECONDS);
    if (byDuration.length === 0) return null;
    byDuration.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    return { id: byDuration[0].id, seconds: byDuration[0].seconds };
  }
  valid.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return { id: valid[0].id, seconds: valid[0].seconds };
}

/** Sesión larga (≥15 min), priorizando vídeos recientes. */
export async function fetchYouTubeForSession(
  artistName: string,
  apiKey?: string
): Promise<SessionVideoResult> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artistName} makina remember sesion DJ set`)}`;

  if (apiKey) {
    try {
      const q = encodeURIComponent(`${artistName} makina remember sesion`);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=long&order=date&maxResults=10&q=${q}&key=${apiKey}&relevanceLanguage=es`
      );
      if (res.ok) {
        const data = (await res.json()) as {
          items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; publishedAt?: string } }>;
        };
        const ids = (data.items ?? [])
          .map((i) => i.id?.videoId)
          .filter(Boolean) as string[];
        const durations = await fetchVideoDurationsApi(ids, apiKey);
        const candidates = ids.map((id) => {
          const meta = durations.get(id);
          const snippet = data.items?.find((i) => i.id?.videoId === id)?.snippet;
          return {
            id,
            seconds: meta?.seconds ?? 0,
            publishedAt: meta?.publishedAt ?? snippet?.publishedAt ?? null,
            title: snippet?.title ?? null,
          };
        });
        const picked = pickBestSessionCandidate(artistName, candidates);
        if (picked) {
          return {
            videoUrl: `https://www.youtube.com/watch?v=${picked.id}`,
            durationMinutes: secondsToMinutes(picked.seconds),
            searchUrl,
          };
        }
      }
    } catch {
      /* fallback scrape */
    }
  }

  const query = `${artistName} makina remember sesion DJ set`;
  const ids = searchVideoIds(query, 15);
  const candidates: Array<{ id: string; seconds: number; publishedAt: string | null; title: string | null }> = [];

  for (const id of ids) {
    const meta = scrapeVideoMeta(id);
    if (meta.durationSeconds == null) continue;
    candidates.push({
      id,
      seconds: meta.durationSeconds,
      publishedAt: meta.publishedAt,
      title: meta.title,
    });
  }

  const picked = pickBestSessionCandidate(artistName, candidates);
  if (picked) {
    return {
      videoUrl: `https://www.youtube.com/watch?v=${picked.id}`,
      durationMinutes: secondsToMinutes(picked.seconds),
      searchUrl,
    };
  }

  return { videoUrl: null, durationMinutes: null, searchUrl };
}

/** Tema completo (2–12 min), no sesiones ni shorts. */
export async function fetchYouTubeForTrack(
  artistName: string,
  trackTitle: string,
  apiKey?: string
): Promise<string | null> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artistName} ${trackTitle}`)}`;
  if (!apiKey) {
    const ids = searchVideoIds(`${artistName} ${trackTitle} makina`, 10);
    for (const id of ids) {
      const meta = scrapeVideoMeta(id);
      if (
        meta.durationSeconds != null &&
        meta.durationSeconds >= MIN_TRACK_SECONDS &&
        meta.durationSeconds <= MAX_TRACK_SECONDS
      ) {
        return `https://www.youtube.com/watch?v=${id}`;
      }
    }
    return searchUrl;
  }

  try {
    const q = encodeURIComponent(`${artistName} ${trackTitle} makina`);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=medium&maxResults=8&q=${q}&key=${apiKey}&relevanceLanguage=es`
    );
    if (!res.ok) return searchUrl;
    const data = (await res.json()) as {
      items?: Array<{ id?: { videoId?: string } }>;
    };
    const ids = (data.items ?? [])
      .map((i) => i.id?.videoId)
      .filter(Boolean) as string[];
    const durations = await fetchVideoDurationsApi(ids, apiKey);
    for (const id of ids) {
      const seconds = durations.get(id)?.seconds;
      if (seconds != null && seconds >= MIN_TRACK_SECONDS && seconds <= MAX_TRACK_SECONDS) {
        return `https://www.youtube.com/watch?v=${id}`;
      }
    }
    return searchUrl;
  } catch {
    return searchUrl;
  }
}

/** @deprecated Usa fetchYouTubeForSession para sesiones */
export async function fetchYouTubeForArtist(
  artistName: string,
  apiKey?: string
): Promise<YouTubeResult> {
  const session = await fetchYouTubeForSession(artistName, apiKey);
  return {
    channelUrl: null,
    videoUrl: session.videoUrl,
    searchUrl: session.searchUrl,
  };
}
