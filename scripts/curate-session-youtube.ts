/**
 * Genera enlaces watch?v= verificados para sesiones ({slug}-sesion-makina).
 *
 * npm run db:curate-sessions-youtube
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "fs";
import path from "path";
import { MAKINA_ARTISTS } from "../data/makina-artists";

function curlText(url: string, maxBuffer = 4 * 1024 * 1024): string {
  return execSync(`curl -fsSL --max-redirs 5 -A "Mozilla/5.0 (MakinaHub)" ${JSON.stringify(url)}`, {
    encoding: "utf8",
    maxBuffer,
    timeout: 25_000,
  });
}

function oembedTitle(videoId: string): string | null {
  try {
    const out = curlText(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      512 * 1024
    );
    return (JSON.parse(out) as { title?: string }).title ?? null;
  } catch {
    return null;
  }
}

function searchVideoIds(query: string): string[] {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const html = curlText(url);
    return [
      ...new Set(
        [...html.matchAll(/watch\?v=([a-zA-Z0-9_-]{11})/g)].map((m) => m[1])
      ),
    ].slice(0, 10);
  } catch {
    return [];
  }
}

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

async function main() {
  const curated: Record<string, string> = {};

  for (const seed of MAKINA_ARTISTS) {
    const slug = `${seed.slug}-sesion-makina`;
    const classic = seed.classics?.[0];
    const query = classic
      ? `${seed.name} ${classic} makina remember sesion`
      : `${seed.name} makina remember DJ session`;

    process.stderr.write(`${slug}… `);
    const ids = searchVideoIds(query);
    let picked: string | null = null;

    for (const id of ids) {
      const ytTitle = oembedTitle(id);
      if (!ytTitle) continue;
      if (sessionMatches(seed.name, ytTitle)) {
        picked = id;
        process.stderr.write(`${id} (${ytTitle.slice(0, 45)})\n`);
        break;
      }
    }

    if (!picked && ids[0]) {
      picked = ids[0];
      const ytTitle = oembedTitle(picked);
      process.stderr.write(`${picked}? (${ytTitle?.slice(0, 45) ?? "?"})\n`);
    } else if (!picked) {
      process.stderr.write("none\n");
    }

    if (picked) curated[slug] = `https://www.youtube.com/watch?v=${picked}`;
    await new Promise((r) => setTimeout(r, 200));
  }

  const outPath = path.join(__dirname, "../src/data/curated-session-youtube.ts");
  const body = `/** Generado con npm run db:curate-sessions-youtube */
export const CURATED_SESSION_WATCH_BY_SLUG: Record<string, string> = ${JSON.stringify(curated, null, 2)};
`;
  writeFileSync(outPath, body);
  console.log(
    `\n✅ ${Object.keys(curated).length}/${MAKINA_ARTISTS.length} sesiones → src/data/curated-session-youtube.ts\n`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
