import { CURATED_SESSION_WATCH_BY_SLUG } from "@/data/curated-session-youtube";
import { youtubeThumbnail } from "@/lib/youtube";

/** Miniatura de la sesión curada del artista (fallback visual sin foto en BD). */
export function curatedSessionThumbForArtist(artistSlug: string): string | null {
  const watch = CURATED_SESSION_WATCH_BY_SLUG[`${artistSlug}-sesion-makina`];
  return watch ? youtubeThumbnail(watch) : null;
}
