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

export function artistNameMatches(artistName: string, ytTitle: string): boolean {
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

function rankSessionCandidates(
  artistName: string,
  candidates: Array<{
    id: string;
    seconds: number;
    publishedAt: string | null;
    title: string | null;
  }>
): SessionCandidate[] {
  const valid = candidates.filter((c) => c.seconds >= MIN_SESSION_SECONDS);
  const matched = valid.filter((c) => artistNameMatches(artistName, c.title ?? ""));
  const pool = matched.length > 0 ? matched : valid;
  pool.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return pool.map((c) => ({
    videoId: c.id,
    videoUrl: `https://www.youtube.com/watch?v=${c.id}`,
    title: c.title ?? `${artistName} — Sesión mákina`,
    publishedAt: c.publishedAt ?? new Date(0).toISOString(),
    durationMinutes: secondsToMinutes(c.seconds) ?? 0,
  }));
}

export type SessionCandidate = {
  videoId: string;
  videoUrl: string;
  title: string;
  publishedAt: string;
  durationMinutes: number;
  channelTitle?: string | null;
};

export const GLOBAL_MAKINA_SESSION_QUERIES = [
  "makina remember sesion DJ set",
  "makina catalana sesion completa",
  "remember catalunya DJ session",
  "chasis session remember makina",
  "makina legends session",
  "love makina session",
  "pont aeri session remember",
  "bit music session remember",
  "scorpia session remember",
  "hardcore català session",
  "sesion makina valencia",
  "sesion makina barcelona",
  "DJ set makina remember",
  "old school makina session",
  "revival makina session",
  "terminal session remember",
  "xque session remember",
  "bluemoon session remember",
];

const SESSION_TITLE_KEYWORDS = [
  "makina",
  "mákina",
  "remember",
  "hardcore catal",
  "chasis",
  "pont aeri",
  "bit music",
  "scorpia",
  "love makina",
  "makina legends",
  "terminal",
  "sesion",
  "sesión",
  "session",
  "dj set",
  "live set",
];

const SESSION_TITLE_EXCLUDE = [
  "reaction",
  "react ",
  "tutorial",
  "unboxing",
  "review ",
  "interview",
  "podcast",
];

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isMakinaSessionTitle(title: string): boolean {
  const t = normalizeSearchText(title);
  if (SESSION_TITLE_EXCLUDE.some((word) => t.includes(word))) return false;
  return SESSION_TITLE_KEYWORDS.some((keyword) =>
    t.includes(normalizeSearchText(keyword))
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type SearchSnippet = {
  videoId: string;
  title: string | null;
  channelTitle: string | null;
  publishedAt: string | null;
};

async function youtubeSearchVideos(
  query: string,
  apiKey: string,
  publishedAfter?: string
): Promise<SearchSnippet[]> {
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    videoDuration: "long",
    order: "date",
    maxResults: "25",
    q: query,
    key: apiKey,
    relevanceLanguage: "es",
  });
  if (publishedAfter) params.set("publishedAfter", publishedAfter);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
  );
  if (!res.ok) return [];

  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        publishedAt?: string;
      };
    }>;
  };

  return (data.items ?? [])
    .map((item) => ({
      videoId: item.id?.videoId ?? "",
      title: item.snippet?.title ?? null,
      channelTitle: item.snippet?.channelTitle ?? null,
      publishedAt: item.snippet?.publishedAt ?? null,
    }))
    .filter((item) => item.videoId.length === 11);
}

/** Busca sesiones mákina en todo YouTube (no limitado al roster de artistas). */
export async function fetchGlobalMakinaSessions(
  apiKey?: string,
  options?: { maxTotal?: number; recentDays?: number }
): Promise<SessionCandidate[]> {
  const maxTotal = options?.maxTotal ?? 200;
  const publishedAfter = options?.recentDays
    ? new Date(Date.now() - options.recentDays * 86_400_000).toISOString()
    : undefined;

  const year = new Date().getFullYear();
  const queries = [
    ...GLOBAL_MAKINA_SESSION_QUERIES,
    `sesion makina ${year}`,
    `sesion makina ${year - 1}`,
  ];

  const snippets = new Map<string, SearchSnippet>();

  if (apiKey) {
    for (const query of queries) {
      const found = await youtubeSearchVideos(query, apiKey, publishedAfter);
      for (const item of found) snippets.set(item.videoId, item);
      await sleep(180);
    }

    const ids = [...snippets.keys()];
    const results: SessionCandidate[] = [];

    for (let i = 0; i < ids.length && results.length < maxTotal; i += 50) {
      const chunk = ids.slice(i, i + 50);
      const durations = await fetchVideoDurationsApi(chunk, apiKey);

      for (const id of chunk) {
        const meta = durations.get(id);
        const snippet = snippets.get(id);
        const title = snippet?.title;
        if (!title || !isMakinaSessionTitle(title)) continue;
        const seconds = meta?.seconds ?? 0;
        if (seconds < MIN_SESSION_SECONDS) continue;

        results.push({
          videoId: id,
          videoUrl: `https://www.youtube.com/watch?v=${id}`,
          title,
          publishedAt:
            meta?.publishedAt ?? snippet?.publishedAt ?? new Date(0).toISOString(),
          durationMinutes: secondsToMinutes(seconds) ?? 0,
          channelTitle: snippet?.channelTitle ?? null,
        });
      }
      await sleep(120);
    }

    results.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return results.slice(0, maxTotal);
  }

  const results: SessionCandidate[] = [];
  const seen = new Set<string>();

  for (const query of queries.slice(0, 10)) {
    const ids = searchVideoIds(query, 18);
    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      const meta = scrapeVideoMeta(id);
      if (!meta.title || !isMakinaSessionTitle(meta.title)) continue;
      if (meta.durationSeconds == null || meta.durationSeconds < MIN_SESSION_SECONDS) {
        continue;
      }
      results.push({
        videoId: id,
        videoUrl: `https://www.youtube.com/watch?v=${id}`,
        title: meta.title,
        publishedAt: meta.publishedAt ?? new Date(0).toISOString(),
        durationMinutes: secondsToMinutes(meta.durationSeconds) ?? 0,
        channelTitle: null,
      });
      if (results.length >= maxTotal) break;
    }
    if (results.length >= maxTotal) break;
  }

  results.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return results.slice(0, maxTotal);
}

/** Varios sets recientes por artista (≥15 min), ordenados por fecha YouTube. */
export async function fetchRecentSessionsForArtist(
  artistName: string,
  apiKey?: string,
  limit = 3
): Promise<SessionCandidate[]> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artistName} makina remember sesion DJ set`)}`;

  if (apiKey) {
    try {
      const q = encodeURIComponent(`${artistName} makina remember sesion`);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=long&order=date&maxResults=15&q=${q}&key=${apiKey}&relevanceLanguage=es`
      );
      if (res.ok) {
        const data = (await res.json()) as {
          items?: Array<{
            id?: { videoId?: string };
            snippet?: { title?: string; publishedAt?: string };
          }>;
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
        return rankSessionCandidates(artistName, candidates).slice(0, limit);
      }
    } catch {
      /* fallback scrape */
    }
  }

  const query = `${artistName} makina remember sesion DJ set`;
  const ids = searchVideoIds(query, 20);
  const candidates: Array<{
    id: string;
    seconds: number;
    publishedAt: string | null;
    title: string | null;
  }> = [];

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

  const ranked = rankSessionCandidates(artistName, candidates);
  if (ranked.length === 0 && searchUrl) {
    void searchUrl;
  }
  return ranked.slice(0, limit);
}

/** Sesión larga (≥15 min), priorizando vídeos recientes. */
export async function fetchYouTubeForSession(
  artistName: string,
  apiKey?: string
): Promise<SessionVideoResult> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artistName} makina remember sesion DJ set`)}`;
  const recent = await fetchRecentSessionsForArtist(artistName, apiKey, 1);
  if (recent[0]) {
    return {
      videoUrl: recent[0].videoUrl,
      durationMinutes: recent[0].durationMinutes,
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
