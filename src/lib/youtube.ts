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
