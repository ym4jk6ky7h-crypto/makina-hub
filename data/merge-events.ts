import type { CatalanMakinaEventSeed } from "./catalan-makina-event-types";
import { ALL_CATALAN_MAKINA_EVENTS } from "./catalan-makina-events";
import { isGenericStockImage } from "../src/lib/images/stock-image";
import { readJson } from "../scripts/lib/auto-store";

type AutoEventsFile = { fetchedAt: string; events: CatalanMakinaEventSeed[] };

function enrichStockImagesFromAuto(
  manual: CatalanMakinaEventSeed,
  autoEvents: CatalanMakinaEventSeed[]
): CatalanMakinaEventSeed {
  if (!isGenericStockImage(manual.imageUrl)) return manual;

  const byDate = autoEvents.filter(
    (a) => a.eventDate === manual.eventDate && !isGenericStockImage(a.imageUrl)
  );
  if (byDate.length === 0) return manual;

  const titleKey = manual.title.toLowerCase().slice(0, 12);
  const match =
    byDate.find((a) => a.title.toLowerCase().includes(titleKey.slice(0, 8))) ??
    byDate.find((a) => manual.title.toLowerCase().includes("makina legends")) ??
    byDate[0];

  return {
    ...manual,
    imageUrl: match.imageUrl,
    eventPageUrl:
      manual.eventPageUrl?.endsWith("/eventos/") && match.eventPageUrl
        ? match.eventPageUrl
        : manual.eventPageUrl,
  };
}

/** Catálogo manual + eventos auto (Makina Legends, etc.) */
export function getMergedEventCatalog(): CatalanMakinaEventSeed[] {
  const auto = readJson<AutoEventsFile>("fetched-events.json", {
    fetchedAt: "",
    events: [],
  });

  const bySlug = new Map<string, CatalanMakinaEventSeed>();

  for (const e of ALL_CATALAN_MAKINA_EVENTS) {
    bySlug.set(e.slug, enrichStockImagesFromAuto(e, auto.events));
  }

  for (const e of auto.events) {
    const existing = bySlug.get(e.slug);
    if (existing) {
      bySlug.set(e.slug, {
        ...existing,
        ...e,
        imageUrl: isGenericStockImage(e.imageUrl)
          ? existing.imageUrl
          : e.imageUrl ?? existing.imageUrl,
        artistSlugs: e.artistSlugs.length ? e.artistSlugs : existing.artistSlugs,
      });
    } else {
      bySlug.set(e.slug, e);
    }
  }

  return [...bySlug.values()].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
}
