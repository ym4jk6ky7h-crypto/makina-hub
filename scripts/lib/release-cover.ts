function upscaleItunesArtwork(url: string): string {
  return url.replace(/100x100bb\.jpg$/, "600x600bb.jpg");
}

/** Portada vía iTunes Search (sin API key). */
export async function fetchReleaseCoverUrl(
  artistName: string,
  title: string
): Promise<string | null> {
  const term = encodeURIComponent(`${artistName} ${title}`);
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: Array<{ artworkUrl100?: string; artistName?: string }>;
    };
    const normalizedArtist = artistName.toLowerCase();
    const match =
      data.results?.find(
        (r) =>
          r.artworkUrl100 &&
          r.artistName?.toLowerCase().includes(normalizedArtist.split(" ")[0] ?? "")
      ) ?? data.results?.find((r) => r.artworkUrl100);
    const url = match?.artworkUrl100;
    return url ? upscaleItunesArtwork(url) : null;
  } catch {
    return null;
  }
}

/** Portada vía Discogs Search (requiere DISCOGS_TOKEN). */
export async function fetchDiscogsReleaseCoverUrl(
  artistName: string,
  title: string,
  token: string
): Promise<string | null> {
  const q = encodeURIComponent(`${artistName} ${title}`);
  try {
    const res = await fetch(
      `https://api.discogs.com/database/search?q=${q}&type=release&per_page=5`,
      {
        headers: {
          Authorization: `Discogs token=${token}`,
          "User-Agent": "MakinaHub/1.0",
        },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: Array<{ thumb?: string; cover_image?: string; title?: string }>;
    };
    const normalizedArtist = artistName.toLowerCase().split(" ")[0] ?? "";
    const match =
      data.results?.find(
        (r) =>
          (r.cover_image || r.thumb) &&
          r.title?.toLowerCase().includes(normalizedArtist)
      ) ?? data.results?.find((r) => r.cover_image || r.thumb);
    const url = match?.cover_image ?? match?.thumb;
    if (!url || url.includes("spacer.gif")) return null;
    return url.replace(/\/fit-in\/\d+x\d+\//, "/fit-in/600x600/");
  } catch {
    return null;
  }
}

export async function fetchBestReleaseCoverUrl(
  artistName: string,
  title: string,
  discogsToken?: string
): Promise<string | null> {
  const itunes = await fetchReleaseCoverUrl(artistName, title);
  if (itunes) return itunes;
  if (discogsToken) {
    return fetchDiscogsReleaseCoverUrl(artistName, title, discogsToken);
  }
  return null;
}
