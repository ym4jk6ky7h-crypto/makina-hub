const UA = "MakinaHub/1.0 (educational music database)";

function extractOgImage(html: string): string | null {
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:image"/i,
    /property='og:image'\s+content='([^']+)'/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1].replace(/&amp;/g, "&");
  }
  return null;
}

/** Intenta obtener imagen de perfil/cartel desde og:image de una URL pública. */
export async function fetchOgImage(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": UA },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractOgImage(html);
  } catch {
    return null;
  }
}

/** Miniatura de vídeo YouTube (avatar alternativo si hay canal). */
export function youtubeThumbnailFromUrl(youtubeUrl: string | null): string | null {
  if (!youtubeUrl) return null;
  const m = youtubeUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (!m) return null;
  return `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`;
}

export async function fetchSocialImages(urls: (string | null | undefined)[]): Promise<string | null> {
  for (const url of urls.filter(Boolean) as string[]) {
    const img = await fetchOgImage(url);
    if (img && !img.includes("default_avatar")) return img;
  }
  return null;
}
