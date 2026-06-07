/** Descargas/compra curadas por slug de tema (enlaces externos legales). */
export const CURATED_TRACK_DOWNLOAD_BY_SLUG: Record<string, string> = {
  "pastis-game-over-ii":
    "https://www.junodownload.com/search/?q[]=pastis+game+over",
  "pastis-amazon-e":
    "https://www.junodownload.com/search/?q[]=pastis+amazon",
  "buenri-amazon-e":
    "https://www.junodownload.com/search/?q[]=buenri+amazon",
};

/** Audio alojado en Supabase Storage (subir con npm run db:sync-track-audio). */
export function hostedPreviewUrl(slug: string, supabaseUrl: string): string {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/track-previews/${slug}.mp3`;
}
