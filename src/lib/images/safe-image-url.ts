/** Hostnames permitidos para next/image (sincronizar con next.config.ts). */
export const IMAGE_REMOTE_HOSTS = [
  "images.unsplash.com",
  "i.ytimg.com",
  "yt3.ggpht.com",
  "yt3.googleusercontent.com",
  "is1-ssl.mzstatic.com",
  "is2-ssl.mzstatic.com",
  "is3-ssl.mzstatic.com",
  "is4-ssl.mzstatic.com",
  "is5-ssl.mzstatic.com",
  "upload.wikimedia.org",
  "ui-avatars.com",
  "i.discogs.com",
  "img.discogs.com",
  "commons.wikimedia.org",
  "www.makinalegends.com",
  "makinalegends.com",
  "www.barcelonarememberfestival.com",
  "scontent.cdninstagram.com",
  "platform-lookaside.fbsbx.com",
  "lh3.googleusercontent.com",
] as const;

const ALLOWED_IMAGE_HOSTS = new Set<string>(IMAGE_REMOTE_HOSTS);

export function isAllowedImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    if ([...ALLOWED_IMAGE_HOSTS].some((allowed) => hostMatches(host, allowed))) {
      return true;
    }
    // Instagram CDN regional (scontent-mad1-1.cdninstagram.com, etc.)
    return host.includes("cdninstagram.com") || host.endsWith(".fbcdn.net");
  } catch {
    return false;
  }
}

function hostMatches(host: string, allowed: string): boolean {
  const a = allowed.toLowerCase();
  return host === a || host === `www.${a}` || host.endsWith(`.${a}`);
}

export function safeAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
  } catch {
    /* ignore */
  }
  return undefined;
}
