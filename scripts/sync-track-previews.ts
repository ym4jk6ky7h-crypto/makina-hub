/**
 * Vincula previews de iTunes (30s) y enlaces de descarga a temas en Supabase.
 * Requiere migración 005_track_audio.sql aplicada.
 *
 * Uso: npm run db:sync-track-previews
 */
import { loadEnv } from "./lib/supabase-admin";
import { createAdminClient } from "./lib/supabase-admin";
import { CURATED_TRACK_DOWNLOAD_BY_SLUG } from "../src/data/curated-track-audio";

loadEnv();

type ItunesResult = {
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
};

async function fetchItunesPreview(
  artistName: string,
  trackTitle: string
): Promise<string | null> {
  const term = encodeURIComponent(`${artistName} ${trackTitle}`);
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: ItunesResult[] };
    const match = data.results?.find((r) => r.previewUrl);
    return match?.previewUrl ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const supabase = createAdminClient();
  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("id, slug, title, preview_url, download_url, artist:artists(name)")
    .order("year", { ascending: false });

  if (error) throw error;

  let updated = 0;
  let skipped = 0;

  for (const row of tracks ?? []) {
    const artist = row.artist as { name: string } | { name: string }[] | null;
    const artistName = Array.isArray(artist) ? artist[0]?.name : artist?.name;
    if (!artistName) {
      skipped++;
      continue;
    }

    const preview =
      row.preview_url ||
      (await fetchItunesPreview(artistName, row.title));
    const download =
      row.download_url || CURATED_TRACK_DOWNLOAD_BY_SLUG[row.slug] || null;

    if (!preview && !download) {
      skipped++;
      continue;
    }

    const { error: upErr } = await supabase
      .from("tracks")
      .update({
        preview_url: preview,
        download_url: download,
        source_type: preview && !row.preview_url ? "itunes_preview" : undefined,
      })
      .eq("id", row.id);

    if (upErr) {
      console.warn(`⚠ ${row.slug}: ${upErr.message}`);
      skipped++;
    } else {
      updated++;
      console.log(`✓ ${row.slug}${preview ? " +preview" : ""}${download ? " +download" : ""}`);
    }

    await new Promise((r) => setTimeout(r, 120));
  }

  console.log(`\nListo: ${updated} actualizados, ${skipped} sin cambios.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
