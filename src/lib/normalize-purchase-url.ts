/** Enlaces Discogs guardados a veces como ruta relativa */
export function normalizePurchaseUrl(url: string): string {
  const u = url.trim();
  if (!u) return u;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `https://www.discogs.com${u}`;
  return u;
}
