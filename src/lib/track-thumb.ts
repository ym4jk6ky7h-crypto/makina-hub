import type { TrackWithRelations } from "@/types/database";

/** Miniatura de tema: sin YouTube en catálogo de música (artwork vía iTunes en ficha). */
export function getTrackThumbnailSync(_track: TrackWithRelations): string | null {
  void _track;
  return null;
}
