/**
 * Descarga datos externos → data/auto/*.json
 * npm run db:fetch-auto
 * npm run db:fetch-auto -- --quick   (menos peticiones, para cron)
 */
import { fetchMakinaLegendsEvents } from "./lib/fetchers/makina-legends-events";
import { fetchDiscogsCatalog } from "./lib/fetchers/discogs-catalog";
import { readJson, writeAutoMeta, writeJson, type AutoSyncMeta } from "./lib/auto-store";
import { loadEnv } from "./lib/supabase-admin";

loadEnv();

const quick = process.argv.includes("--quick");

async function main() {
  const errors: string[] = [];
  let eventCount = 0;
  let releaseCount = 0;
  let trackCount = 0;

  console.log("\n🌐 Makina Hub — fetch automático\n");

  try {
    console.log("📅 Makina Legends…");
    const events = await fetchMakinaLegendsEvents({
      maxPages: quick ? 25 : 60,
    });
    writeJson("fetched-events.json", {
      fetchedAt: new Date().toISOString(),
      events,
    });
    eventCount = events.length;
    console.log(`   ✓ ${eventCount} eventos\n`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push(`events: ${msg}`);
    console.log(`   ✗ ${msg}\n`);
  }

  const discogsToken = process.env.DISCOGS_TOKEN;
  if (discogsToken) {
    try {
      console.log("💿 Discogs (releases + temas)…");
      const prevReleases = readJson<{ releases: unknown[] }>("fetched-releases.json", {
        releases: [],
      });
      const prevTracks = readJson<{ tracks: unknown[] }>("fetched-tracks.json", {
        tracks: [],
      });

      const { releases, tracks } = await fetchDiscogsCatalog({
        token: discogsToken,
        batchSize: quick ? 10 : 18,
      });

      const releaseMap = new Map(
        (prevReleases.releases as { slug: string }[]).map((r) => [r.slug, r])
      );
      for (const r of releases) releaseMap.set(r.slug, r);

      const trackMap = new Map(
        (prevTracks.tracks as { artistSlug: string; slug: string }[]).map((t) => [
          `${t.artistSlug}:${t.slug}`,
          t,
        ])
      );
      for (const t of tracks) trackMap.set(`${t.artistSlug}:${t.slug}`, t);

      writeJson("fetched-releases.json", {
        fetchedAt: new Date().toISOString(),
        releases: [...releaseMap.values()],
      });
      writeJson("fetched-tracks.json", {
        fetchedAt: new Date().toISOString(),
        tracks: [...trackMap.values()],
      });

      releaseCount = releases.length;
      trackCount = tracks.length;
      console.log(`   ✓ +${releaseCount} releases, +${trackCount} temas (acumulativo)\n`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`discogs: ${msg}`);
      console.log(`   ✗ ${msg}\n`);
    }
  } else {
    console.log("   ⊘ DISCOGS_TOKEN no configurado — saltando novedades/temas auto\n");
  }

  const meta: AutoSyncMeta = {
    lastRun: new Date().toISOString(),
    events: eventCount,
    releases: releaseCount,
    tracks: trackCount,
    errors,
  };
  writeAutoMeta(meta);

  console.log("✅ Fetch terminado\n");
  if (errors.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
