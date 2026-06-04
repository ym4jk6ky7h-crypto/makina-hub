/** Extrae el ID de un vídeo de YouTube (watch, youtu.be, embed). */
export function youtubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m =
    url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/) ??
    url.match(/^([a-zA-Z0-9_-]{11})$/);
  return m?.[1] ?? null;
}

export function youtubeThumbnail(url: string | null | undefined): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function isDirectYoutubeWatch(url: string | null | undefined): boolean {
  return youtubeVideoId(url) !== null;
}

/** Cualquier URL de YouTube (vídeo, búsqueda, canal…) */
export function isYoutubeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be";
  } catch {
    return /youtube\.com|youtu\.be/i.test(url);
  }
}

/** Enlace para abrir la sesión en YouTube (vídeo o búsqueda) */
export function sessionYoutubeHref(url: string | null | undefined): string | null {
  if (!url || !isYoutubeUrl(url)) return null;
  return url;
}

/** URL del iframe embebido (privacidad mejorada con youtube-nocookie) */
export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
