/** Imágenes genéricas de stock (no son carteles/portadas reales). */
export function isGenericStockImage(url: string | null | undefined): boolean {
  if (!url) return true;
  const u = url.toLowerCase();
  return u.includes("images.unsplash.com") || u.includes("ui-avatars.com/api");
}

export function isMakinaLegendsEventPage(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("makinalegends.com/tc-events/");
}
