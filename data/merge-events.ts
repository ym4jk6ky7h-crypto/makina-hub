import type { CatalanMakinaEventSeed } from "./catalan-makina-event-types";
import { ALL_CATALAN_MAKINA_EVENTS } from "./catalan-makina-events";
import { readJson } from "../scripts/lib/auto-store";

type AutoEventsFile = { fetchedAt: string; events: CatalanMakinaEventSeed[] };

/** Catálogo manual + eventos auto (Makina Legends, etc.) */
export function getMergedEventCatalog(): CatalanMakinaEventSeed[] {
  const auto = readJson<AutoEventsFile>("fetched-events.json", {
    fetchedAt: "",
    events: [],
  });

  const bySlug = new Map<string, CatalanMakinaEventSeed>();

  for (const e of ALL_CATALAN_MAKINA_EVENTS) {
    bySlug.set(e.slug, e);
  }

  for (const e of auto.events) {
    const existing = bySlug.get(e.slug);
    if (existing) {
      bySlug.set(e.slug, {
        ...existing,
        ...e,
        artistSlugs: e.artistSlugs.length ? e.artistSlugs : existing.artistSlugs,
      });
    } else {
      bySlug.set(e.slug, e);
    }
  }

  return [...bySlug.values()].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
}
