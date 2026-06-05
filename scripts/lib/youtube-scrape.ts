import { execSync } from "node:child_process";

export type ScrapedVideoMeta = {
  durationSeconds: number | null;
  publishedAt: string | null;
  title: string | null;
};

function curlText(url: string, maxBuffer = 4 * 1024 * 1024): string {
  return execSync(
    `curl -fsSL --max-redirs 5 -A "Mozilla/5.0 (MakinaHub)" ${JSON.stringify(url)}`,
    { encoding: "utf8", maxBuffer, timeout: 25_000 }
  );
}

export function scrapeVideoMeta(videoId: string): ScrapedVideoMeta {
  try {
    const html = curlText(`https://www.youtube.com/watch?v=${videoId}`);
    const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
    const dateMatch =
      html.match(/"publishDate":"([^"]+)"/) ??
      html.match(/"datePublished":"([^"]+)"/);
    const titleMatch = html.match(/"title":"((?:\\.|[^"\\])*)"/);
    return {
      durationSeconds: lengthMatch ? Number(lengthMatch[1]) : null,
      publishedAt: dateMatch?.[1] ?? null,
      title: titleMatch?.[1]?.replace(/\\u0026/g, "&") ?? null,
    };
  } catch {
    return { durationSeconds: null, publishedAt: null, title: null };
  }
}

export function searchVideoIds(query: string, limit = 12): string[] {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIYAw%253D%253D`;
    const html = curlText(url);
    return [
      ...new Set(
        [...html.matchAll(/watch\?v=([a-zA-Z0-9_-]{11})/g)].map((m) => m[1])
      ),
    ].slice(0, limit);
  } catch {
    return [];
  }
}
