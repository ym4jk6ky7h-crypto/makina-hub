/**
 * Sincroniza enlaces de descarga curados (sin previews iTunes).
 * npm run db:sync-track-downloads
 */
import { loadEnv } from "./lib/supabase-admin";
import { createAdminClient } from "./lib/supabase-admin";
import { CURATED_TRACK_DOWNLOAD_BY_SLUG } from "../src/data/curated-track-audio";

loadEnv();

async function main() {
  const supabase = createAdminClient();
  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("id, slug, download_url")
    .order("year", { ascending: false });

  if (error) throw error;

  let updated = 0;

  for (const row of tracks ?? []) {
    const download =
      row.download_url || CURATED_TRACK_DOWNLOAD_BY_SLUG[row.slug] || null;
    if (!download || row.download_url) continue;

    const { error: upErr } = await supabase
      .from("tracks")
      .update({ download_url: download })
      .eq("id", row.id);

    if (upErr) {
      console.warn(`⚠ ${row.slug}: ${upErr.message}`);
    } else {
      updated++;
      console.log(`✓ ${row.slug} +download`);
    }
  }

  console.log(`\nListo: ${updated} enlaces de descarga actualizados.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
