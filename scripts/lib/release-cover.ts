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
      data.results?.find((r) =>
        r.artworkUrl100 &&
        r.artistName?.toLowerCase().includes(normalizedArtist.split(" ")[0] ?? "")
      ) ?? data.results?.find((r) => r.artworkUrl100);
    const url = match?.artworkUrl100;
    return url ? upscaleItunesArtwork(url) : null;
  } catch {
    return null;
  }
}
