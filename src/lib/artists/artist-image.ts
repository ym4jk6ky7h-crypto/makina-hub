import { resolveCuratedPortraitUrl } from "@/lib/artists/curated-portrait";
import { isAllowedImageUrl } from "@/lib/images/safe-image-url";

/** Miniaturas de vídeo no son retratos fiables del DJ. */
export function isMisleadingArtistPhoto(url: string | null | undefined): boolean {
  if (!url) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.includes("ytimg.com") ||
      host.includes("ggpht.com") ||
      (host.includes("googleusercontent.com") && url.includes("/vi/"))
    );
  } catch {
    return true;
  }
}

/** Wikipedia automática suele devolver homónimos; solo confiamos en el catálogo curado. */
export function isTrustedArtistPhoto(slug: string, imageUrl?: string | null): boolean {
  if (!imageUrl || !isAllowedImageUrl(imageUrl) || isMisleadingArtistPhoto(imageUrl)) {
    return false;
  }
  const curated = resolveCuratedPortraitUrl(slug);
  if (curated && imageUrl === curated) return true;
  return false;
}

export function artistAvatarUrl(name: string): string {
  const encoded = encodeURIComponent(name.replace(/&/g, "and"));
  return `https://ui-avatars.com/api/?name=${encoded}&size=512&background=1a1a2e&color=ff2d6a&bold=true`;
}

/** URL de foto: catálogo curado → BD verificada → avatar con iniciales. */
export function getArtistImageUrl(
  name: string,
  imageUrl?: string | null,
  artistSlug?: string
): string {
  if (artistSlug) {
    const curated = resolveCuratedPortraitUrl(artistSlug);
    if (curated) return curated;
    if (isTrustedArtistPhoto(artistSlug, imageUrl)) return imageUrl!;
  }
  return artistAvatarUrl(name);
}

export function upscaleWikiThumb(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\/(\d+)px-/, "/640px-");
}
