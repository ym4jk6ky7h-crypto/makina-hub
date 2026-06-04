/** URL de foto del artista o avatar generado con iniciales. */
export function getArtistImageUrl(name: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  const encoded = encodeURIComponent(name.replace(/&/g, "and"));
  return `https://ui-avatars.com/api/?name=${encoded}&size=512&background=1a1a2e&color=ff2d6a&bold=true`;
}

export function upscaleWikiThumb(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\/(\d+)px-/, "/640px-");
}
