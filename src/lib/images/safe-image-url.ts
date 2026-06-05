/** Hostnames permitidos en next.config.ts → images.remotePatterns */
const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "i.ytimg.com",
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
]);

export function isAllowedImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return [...ALLOWED_IMAGE_HOSTS].some((allowed) => {
      const a = allowed.toLowerCase();
      return host === a || host === `www.${a}` || host.endsWith(`.${a}`);
    });
  } catch {
    return false;
  }
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
