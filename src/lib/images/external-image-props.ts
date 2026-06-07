import { isAllowedImageUrl } from "@/lib/images/safe-image-url";

/** Next/Image: URLs externas firmadas (Discogs, etc.) fallan con el optimizador. */
export function preferUnoptimizedImage(url: string | null | undefined): boolean {
  if (!url) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("discogs.com")) return true;
    if (host === "ui-avatars.com" || host === "www.ui-avatars.com") return true;
    if (host.includes("wikimedia.org")) return true;
    if (host.includes("cdninstagram.com") || host.endsWith(".fbcdn.net")) return true;
    return false;
  } catch {
    return true;
  }
}

export function resolveImageSrc(
  url: string | null | undefined,
  fallback: string
): string {
  const trimmed = url?.trim();
  if (trimmed && isAllowedImageUrl(trimmed)) return trimmed;
  return fallback;
}
