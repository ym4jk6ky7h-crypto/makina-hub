import { curatedSessionThumbForArtist } from "@/lib/artists/artist-fallback-image";
import { isAllowedImageUrl } from "@/lib/images/safe-image-url";

/** URL de foto del artista: BD → sesión YouTube curada → avatar con iniciales. */
export function getArtistImageUrl(
  name: string,
  imageUrl?: string | null,
  artistSlug?: string
): string {
  if (imageUrl && isAllowedImageUrl(imageUrl)) return imageUrl;
  if (artistSlug) {
    const sessionThumb = curatedSessionThumbForArtist(artistSlug);
    if (sessionThumb) return sessionThumb;
  }
  const encoded = encodeURIComponent(name.replace(/&/g, "and"));
  return `https://ui-avatars.com/api/?name=${encoded}&size=512&background=1a1a2e&color=ff2d6a&bold=true`;
}

export function upscaleWikiThumb(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\/(\d+)px-/, "/640px-");
}
