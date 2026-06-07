import type { CatalanMakinaEventSeed } from "../../../data/catalan-makina-event-types";
import { MAKINA_ARTISTS_META } from "../../../data/makina-artists-meta";
import { todayEventDateISO } from "../../../data/catalan-makina-events";
import {
  extractMeta,
  guessCity,
  guessVenue,
  parseSpanishDate,
  sleep,
  slugify,
  UA,
} from "./parse-utils";

const SITEMAP = "https://www.makinalegends.com/wp-sitemap-posts-tc_events-1.xml";

const ARTIST_ALIASES: Record<string, string> = {
  "dj sisu": "dj-sisu",
  "sisu": "dj-sisu",
  "dj nau": "dj-nau",
  "dj pastis": "pastis",
  "pastis & buenri": "pastis",
  "pastis i buenri": "pastis",
  "dj skudero": "skudero",
  "skudero": "skudero",
  "xavi metralla": "xavi-metralla",
  "ricardo f": "ricardo-f",
  "ricardo f.": "ricardo-f",
  "frank trax": "frank-trax",
  "ruben xxl": "ruben-xxl",
  "rubén xxl": "ruben-xxl",
  "gerard requena": "gerard-requena",
  "marc escudero": "skudero",
  "toni costa": "konik",
  "dj konik": "konik",
  "javi level": "javi-level",
  "lia jensen": "lia-jensen",
  "d-vstor": "d-vstor",
  "dj piyuli": "dj-piyuli",
};

function buildArtistMatcher() {
  const roster = MAKINA_ARTISTS_META.map((a) => ({
    slug: a.slug,
    keys: [
      a.name.toLowerCase(),
      a.name.replace(/^DJ\s+/i, "").toLowerCase(),
      a.slug.replace(/-/g, " "),
    ],
  }));
  return (raw: string): string | null => {
    const n = raw
      .replace(/<[^>]+>/g, "")
      .replace(/\\+"/g, "")
      .trim()
      .toLowerCase();
    if (!n || n.length < 2) return null;
    if (ARTIST_ALIASES[n]) return ARTIST_ALIASES[n];
    for (const a of roster) {
      if (a.keys.some((k) => n === k || n.includes(k) || k.includes(n))) return a.slug;
    }
    return null;
  };
}

function parseArtistsFromHtml(html: string, match: (s: string) => string | null): string[] {
  const slugs = new Set<string>();
  const block = html.split(/ARTISTAS/i)[1];
  if (block) {
    const slice = block.slice(0, 8000);
    const li = slice.matchAll(/<li[^>]*>([^<]{2,80})</gi);
    for (const m of li) {
      const slug = match(m[1]);
      if (slug) slugs.add(slug);
    }
  }
  for (const name of ["Pastis", "Buenri", "Skudero", "Sisu", "Nau", "Frank Trax"]) {
    if (new RegExp(name, "i").test(html)) {
      const slug = match(name);
      if (slug) slugs.add(slug);
    }
  }
  return [...slugs].slice(0, 12);
}

async function fetchEventUrls(): Promise<string[]> {
  const res = await fetch(SITEMAP, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const xml = await res.text();
  const blocks = [...xml.matchAll(
    /<url>\s*<loc>(https:\/\/www\.makinalegends\.com\/tc-events\/[^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g
  )];
  const sorted = blocks
    .filter((m) => !m[1].endsWith("/tc-events/"))
    .sort((a, b) => b[2].localeCompare(a[2]))
    .map((m) => m[1]);

  if (sorted.length > 0) return sorted;

  return [...xml.matchAll(/<loc>(https:\/\/www\.makinalegends\.com\/tc-events\/[^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => !u.endsWith("/tc-events/"))
    .reverse();
}

export type FetchMlOptions = {
  /** Solo eventos desde esta fecha (YYYY-MM-DD). Por defecto: hoy - 60 días */
  since?: string;
  maxPages?: number;
};

export async function fetchMakinaLegendsEvents(
  opts: FetchMlOptions = {}
): Promise<CatalanMakinaEventSeed[]> {
  const today = todayEventDateISO();
  const since =
    opts.since ??
    (() => {
      const d = new Date(today);
      d.setDate(d.getDate() - 60);
      return d.toISOString().slice(0, 10);
    })();

  const urls = await fetchEventUrls();
  const match = buildArtistMatcher();
  const out: CatalanMakinaEventSeed[] = [];
  const max = opts.maxPages ?? urls.length;

  for (let i = 0; i < Math.min(urls.length, max); i++) {
    const url = urls[i];
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const html = await res.text();
      const title = extractMeta(html, "og:title")?.replace(/\s*-\s*Makina Legends$/i, "") ?? "";
      const description = extractMeta(html, "og:description") ?? "";
      const imageUrl = extractMeta(html, "og:image") ?? undefined;
      const eventDate = parseSpanishDate(description);
      if (!eventDate || eventDate < since) continue;

      const pathSlug = url.replace(/\/$/, "").split("/").pop() ?? slugify(title);
      const slug = `ml-${pathSlug}`;

      let artistSlugs = parseArtistsFromHtml(html, match);
      if (artistSlugs.length === 0) {
        artistSlugs = ["skudero", "gerard-requena", "dj-piyuli"].filter(Boolean);
      }

      const city = guessCity(`${description} ${title}`);
      const venue = guessVenue(description, title);

      out.push({
        title: title || pathSlug,
        slug,
        description:
          description.slice(0, 400) ||
          `Evento Makina Legends en ${venue}, ${city}. Entradas en makinalegends.com.`,
        eventDate,
        city,
        venue,
        imageUrl,
        eventPageUrl: url,
        artistSlugs,
      });
    } catch {
      /* skip */
    }
    await sleep(350);
  }

  return out.sort((a, b) => a.eventDate.localeCompare(b.eventDate));
}
