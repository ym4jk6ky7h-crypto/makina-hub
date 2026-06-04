const MB_API = "https://musicbrainz.org/ws/2";
const UA = "MakinaHub/1.0 (https://makina-hub.app)";

export type MusicBrainzResult = {
  mbid: string | null;
  name: string | null;
  disambiguation: string | null;
  country: string | null;
  lifeSpan: string | null;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  discogsUrl: string | null;
  wikipediaUrl: string | null;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function mbFetch(path: string) {
  const res = await fetch(`${MB_API}${path}`, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Busca artista y extrae URLs oficiales de relaciones */
export async function fetchMusicBrainzArtist(
  artistName: string
): Promise<MusicBrainzResult> {
  const empty: MusicBrainzResult = {
    mbid: null,
    name: null,
    disambiguation: null,
    country: null,
    lifeSpan: null,
    youtubeUrl: null,
    spotifyUrl: null,
    discogsUrl: null,
    wikipediaUrl: null,
  };

  try {
    const q = encodeURIComponent(`artist:"${artistName}"`);
    const search = await mbFetch(`/artist?query=${q}&limit=3&fmt=json`);
    await sleep(1100);

    const artists = search?.artists as Array<{
      id: string;
      name: string;
      disambiguation?: string;
      country?: string;
      "life-span"?: { begin?: string; end?: string };
    }>;

    if (!artists?.length) return empty;

    const best = artists[0];
    const detail = await mbFetch(
      `/artist/${best.id}?inc=url-rels&fmt=json`
    );
    await sleep(1100);

    const rels = detail?.relations as Array<{
      type: string;
      url?: { resource: string };
    }>;

    let youtubeUrl: string | null = null;
    let spotifyUrl: string | null = null;
    let discogsUrl: string | null = null;
    let wikipediaUrl: string | null = null;

    for (const r of rels ?? []) {
      const u = r.url?.resource;
      if (!u) continue;
      if (u.includes("youtube.com") && !youtubeUrl) youtubeUrl = u;
      if (u.includes("open.spotify.com") && !spotifyUrl) spotifyUrl = u;
      if (u.includes("discogs.com") && !discogsUrl) discogsUrl = u;
      if (u.includes("wikipedia.org") && !wikipediaUrl) wikipediaUrl = u;
    }

    const span = best["life-span"];
    const lifeSpan =
      span?.begin || span?.end
        ? `${span.begin ?? "?"} – ${span.end ?? "presente"}`
        : null;

    return {
      mbid: best.id,
      name: best.name,
      disambiguation: best.disambiguation ?? null,
      country: best.country ?? null,
      lifeSpan,
      youtubeUrl,
      spotifyUrl,
      discogsUrl,
      wikipediaUrl,
    };
  } catch {
    return empty;
  }
}
