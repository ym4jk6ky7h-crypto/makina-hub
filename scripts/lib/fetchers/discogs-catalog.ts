import type { NewReleaseSeed } from "../../../data/makina-new-releases";
import { MAKINA_ARTISTS_META } from "../../../data/makina-artists-meta";
import { readJson, writeJson } from "../auto-store";
import { sleep, slugify } from "./parse-utils";

const API = "https://api.discogs.com";

export type AutoTrackSeed = {
  artistSlug: string;
  title: string;
  slug: string;
  year?: number;
  genre?: "makina" | "remember" | "hardcore" | "hardstyle";
  description?: string;
};

type DiscogsCursor = { index: number };

function headers(token: string) {
  return {
    Authorization: `Discogs token=${token}`,
    "User-Agent": "MakinaHub/1.0",
  };
}

async function searchReleases(
  artistName: string,
  token: string,
  minYear: number
): Promise<
  Array<{
    id: number;
    title: string;
    year: string;
    uri: string;
    thumb?: string;
  }>
> {
  const q = encodeURIComponent(artistName);
  const res = await fetch(
    `${API}/database/search?type=release&artist=${q}&per_page=8&sort=year&sort_order=desc`,
    { headers: headers(token) }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    results?: Array<{
      id: number;
      title: string;
      year?: string;
      uri?: string;
      thumb?: string;
    }>;
  };
  return (data.results ?? [])
    .filter((r) => r.id && r.title && Number(r.year) >= minYear)
    .map((r) => ({
      id: r.id,
      title: r.title.split(" - ")[0]?.trim() || r.title,
      year: r.year ?? String(minYear),
      uri: r.uri ?? `https://www.discogs.com/release/${r.id}`,
      thumb: r.thumb,
    }));
}

async function releaseTracklist(
  releaseId: number,
  token: string
): Promise<string[]> {
  await sleep(1100);
  const res = await fetch(`${API}/releases/${releaseId}`, { headers: headers(token) });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    tracklist?: Array<{ title?: string; type_?: string }>;
  };
  return (data.tracklist ?? [])
    .filter((t) => t.title && t.type_ !== "heading")
    .map((t) => t.title!)
    .slice(0, 6);
}

export type FetchDiscogsOptions = {
  token: string;
  /** Artistas por ejecución (rate limit Discogs) */
  batchSize?: number;
  minYear?: number;
};

export async function fetchDiscogsCatalog(opts: FetchDiscogsOptions): Promise<{
  releases: NewReleaseSeed[];
  tracks: AutoTrackSeed[];
}> {
  const batchSize = opts.batchSize ?? 18;
  const minYear = opts.minYear ?? new Date().getFullYear() - 2;
  const cursor = readJson<DiscogsCursor>("discogs-cursor.json", { index: 0 });
  const roster = MAKINA_ARTISTS_META;
  const start = cursor.index % roster.length;

  const releases: NewReleaseSeed[] = [];
  const tracks: AutoTrackSeed[] = [];
  const seenRelease = new Set<string>();

  for (let i = 0; i < batchSize; i++) {
    const artist = roster[(start + i) % roster.length];
    const found = await searchReleases(artist.name, opts.token, minYear);
    await sleep(1100);

    for (const rel of found.slice(0, 3)) {
      const key = `${artist.slug}-${rel.id}`;
      if (seenRelease.has(key)) continue;
      seenRelease.add(key);

      const y = Number(rel.year);
      const releaseDate = `${y}-06-15`;

      releases.push({
        title: rel.title,
        slug: `auto-discogs-${artist.slug}-${rel.id}`,
        artistSlug: artist.slug,
        releaseDate,
        purchaseUrl: rel.uri,
        storeName: "Discogs",
        description: `Publicación detectada en Discogs (${y}). Enlace a la tienda del coleccionista.`,
        genre: "makina",
        coverUrl: rel.thumb,
      });

      const trackTitles = await releaseTracklist(rel.id, opts.token);
      for (const t of trackTitles.slice(0, 4)) {
        tracks.push({
          artistSlug: artist.slug,
          title: t,
          slug: slugify(`auto-${artist.slug}-${rel.id}-${t}`),
          year: y,
          genre: "makina",
          description: `Del release «${rel.title}» (Discogs).`,
        });
      }
    }
  }

  cursor.index = (start + batchSize) % roster.length;
  writeJson("discogs-cursor.json", cursor);

  return { releases, tracks };
}
