/**
 * Genera enlaces watch?v= verificados para sesiones ({slug}-sesion-makina).
 * Solo vídeos ≥15 min; prioriza los más recientes.
 *
 * npm run db:curate-sessions-youtube
 */
import { writeFileSync } from "fs";
import path from "path";
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { MIN_SESSION_SECONDS } from "../src/lib/media-constants";
import { scrapeVideoMeta, searchVideoIds } from "./lib/youtube-scrape";

function sessionMatches(artistName: string, ytTitle: string): boolean {
  const parts = artistName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
  const tl = ytTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return parts.some((p) => tl.includes(p));
}

type Candidate = {
  id: string;
  title: string;
  durationSeconds: number;
  publishedAt: string;
};

function pickSession(candidates: Candidate[], artistName: string): Candidate | null {
  const valid = candidates.filter((c) => c.durationSeconds >= MIN_SESSION_SECONDS);
  if (valid.length === 0) return null;

  const matched = valid.filter((c) => sessionMatches(artistName, c.title));
  const pool = matched.length > 0 ? matched : valid;
  pool.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return pool[0];
}

async function main() {
  const curated: Record<string, string> = {};
  const durations: Record<string, number> = {};

  for (const seed of MAKINA_ARTISTS) {
    const slug = `${seed.slug}-sesion-makina`;
    const classic = seed.classics?.[0];
    const query = classic
      ? `${seed.name} ${classic} makina remember sesion DJ set`
      : `${seed.name} makina remember DJ session set`;

    process.stderr.write(`${slug}… `);
    const ids = searchVideoIds(query, 15);
    const candidates: Candidate[] = [];

    for (const id of ids) {
      const meta = scrapeVideoMeta(id);
      if (meta.durationSeconds == null || !meta.title) continue;
      candidates.push({
        id,
        title: meta.title,
        durationSeconds: meta.durationSeconds,
        publishedAt: meta.publishedAt ?? "",
      });
    }

    const picked = pickSession(candidates, seed.name);
    if (picked) {
      curated[slug] = `https://www.youtube.com/watch?v=${picked.id}`;
      durations[slug] = picked.durationSeconds;
      process.stderr.write(
        `${picked.id} ${Math.round(picked.durationSeconds / 60)}min (${picked.title.slice(0, 40)})\n`
      );
    } else {
      process.stderr.write("none ≥15min\n");
    }

    await new Promise((r) => setTimeout(r, 250));
  }

  const outPath = path.join(__dirname, "../src/data/curated-session-youtube.ts");
  const body = `/** Generado con npm run db:curate-sessions-youtube */
export const CURATED_SESSION_WATCH_BY_SLUG: Record<string, string> = ${JSON.stringify(curated, null, 2)};

export const CURATED_SESSION_DURATION_SEC_BY_SLUG: Record<string, number> = ${JSON.stringify(durations, null, 2)};
`;
  writeFileSync(outPath, body);
  console.log(
    `\n✅ ${Object.keys(curated).length}/${MAKINA_ARTISTS.length} sesiones (≥15 min) → src/data/curated-session-youtube.ts\n`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
