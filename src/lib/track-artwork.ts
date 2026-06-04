import { unstable_cache } from "next/cache";

function upscaleItunesArtwork(url: string): string {
  return url.replace(/100x100bb\.jpg$/, "600x600bb.jpg");
}

async function fetchItunesArtwork(
  artistName: string,
  trackTitle: string
): Promise<string | null> {
  const term = encodeURIComponent(`${artistName} ${trackTitle}`);
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=3`,
      { next: { revalidate: 604800 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: Array<{ artworkUrl100?: string }>;
    };
    const url = data.results?.find((r) => r.artworkUrl100)?.artworkUrl100;
    return url ? upscaleItunesArtwork(url) : null;
  } catch {
    return null;
  }
}

/** Portada de tema vía iTunes (sin cuota YouTube). */
export async function getTrackArtworkUrl(
  artistName: string,
  trackTitle: string
): Promise<string | null> {
  const key = `${artistName}::${trackTitle}`.toLowerCase().slice(0, 120);
  return unstable_cache(
    () => fetchItunesArtwork(artistName, trackTitle),
    ["track-artwork", key],
    { revalidate: 604800 }
  )();
}
