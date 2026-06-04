/**
 * Eventos mákina / remember en Catalunya — catálogo completo.
 * npm run db:discover-events
 */
import { CATALAN_MAKINA_EVENTS_CATALOG } from "./catalan-makina-events-catalog";
export type { CatalanMakinaEventSeed } from "./catalan-makina-event-types";

/** Fecha local de hoy (Europe/Madrid) en YYYY-MM-DD */
export function todayEventDateISO(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Madrid" });
}

/** Todos los eventos del catálogo (pasados y futuros) */
export const ALL_CATALAN_MAKINA_EVENTS = [...CATALAN_MAKINA_EVENTS_CATALOG].sort(
  (a, b) => a.eventDate.localeCompare(b.eventDate)
);

/** Eventos próximos — usado por discover-events para sincronizar Supabase */
export const CATALAN_MAKINA_EVENTS = ALL_CATALAN_MAKINA_EVENTS.filter(
  (e) => e.eventDate >= todayEventDateISO()
);

export const CATALAN_MAKINA_EVENT_COUNT = ALL_CATALAN_MAKINA_EVENTS.length;
export const CATALAN_MAKINA_UPCOMING_COUNT = CATALAN_MAKINA_EVENTS.length;
