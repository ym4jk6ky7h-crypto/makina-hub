/**
 * Genera enlaces watch?v= verificados (oembed) para temas de MAKINA_CLASSIC_TRACKS.
 *
 * npm run db:curate-tracks-youtube
 */
import { writeFileSync } from "fs";
import path from "path";
import { MAKINA_CLASSIC_TRACKS } from "../data/makina-classic-tracks";
import { MIN_TRACK_SECONDS, MAX_TRACK_SECONDS } from "../src/lib/media-constants";
import { scrapeVideoMeta, searchVideoIds as scrapeSearchVideoIds } from "./lib/youtube-scrape";

const ARTIST_SEARCH: Record<string, string> = {
  pastis: "Pastis Buenri",
  buenri: "Pastis Buenri",
  skudero: "Skudero",
  "marc-escudero": "Skudero Marc Escudero",
  "xavi-metralla": "Xavi Metralla",
  "ricardo-f": "Ricardo F",
  "gerard-requena": "Gerard Requena",
  "frank-trax": "Frank Trax",
  ruboy: "Ruboy",
  chumi: "Chumi",
  konik: "Konik",
  "t-ty": "T-TY",
  kullere: "Kullere",
};

async function oembedTitle(videoId: string): Promise<string | null> {
  const res = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { title?: string };
  return data.title ?? null;
}

async function findTrackVideoIds(artist: string, title: string): Promise<string[]> {
  const q = `${artist} ${title} makina`;
  return scrapeSearchVideoIds(q, 10);
}

function isFullTrackDuration(seconds: number): boolean {
  return seconds >= MIN_TRACK_SECONDS && seconds <= MAX_TRACK_SECONDS;
}

function titleMatches(trackTitle: string, ytTitle: string, artist: string): boolean {
  const words = trackTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
  const tl = ytTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (words.some((w) => tl.includes(w))) return true;
  const firstArtist = artist.split(/\s+/)[0]?.toLowerCase();
  return Boolean(firstArtist && firstArtist.length > 2 && tl.includes(firstArtist));
}

async function main() {
  const curated: Record<string, string> = {};

  for (const [artistSlug, tracks] of Object.entries(MAKINA_CLASSIC_TRACKS)) {
    const artist = ARTIST_SEARCH[artistSlug] ?? artistSlug;
    for (const t of tracks) {
      const slug = `${artistSlug}-${t.slug}`;
      process.stderr.write(`${slug}… `);
      const ids = await findTrackVideoIds(artist, t.title);
      let picked: string | null = null;
      for (const id of ids) {
        const meta = scrapeVideoMeta(id);
        const ytTitle = meta.title ?? (await oembedTitle(id));
        if (!ytTitle) continue;
        if (
          meta.durationSeconds != null &&
          !isFullTrackDuration(meta.durationSeconds)
        ) {
          continue;
        }
        if (titleMatches(t.title, ytTitle, artist)) {
          picked = id;
          process.stderr.write(`${id} (${ytTitle.slice(0, 40)})\n`);
          break;
        }
      }
      if (!picked) {
        for (const id of ids) {
          const meta = scrapeVideoMeta(id);
          if (
            meta.durationSeconds != null &&
            isFullTrackDuration(meta.durationSeconds)
          ) {
            picked = id;
            const ytTitle = meta.title ?? (await oembedTitle(id));
            process.stderr.write(`${picked}? (${ytTitle?.slice(0, 40) ?? "?"})\n`);
            break;
          }
        }
      }
      if (picked) curated[slug] = `https://www.youtube.com/watch?v=${picked}`;
      else process.stderr.write("none\n");
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  const outPath = path.join(__dirname, "../src/data/curated-track-youtube.ts");
  const body = `/** Generado con npm run db:curate-tracks-youtube — no editar a mano salvo correcciones. */
export const CURATED_TRACK_WATCH_BY_SLUG: Record<string, string> = ${JSON.stringify(curated, null, 2)};
`;
  writeFileSync(outPath, body);
  console.log(`\n✅ ${Object.keys(curated).length} temas → data/curated-track-youtube.ts\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
