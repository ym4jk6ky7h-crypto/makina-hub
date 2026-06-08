import {
  CURATED_ARTIST_PORTRAITS,
  resolveCuratedPortraitUrl,
} from "@/data/artist-portraits";

export { CURATED_ARTIST_PORTRAITS, resolveCuratedPortraitUrl };

export function getCuratedPortraitUrl(slug: string): string | null {
  return resolveCuratedPortraitUrl(slug);
}
