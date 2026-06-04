/**
 * Sincroniza nuevas producciones mákina con enlace de compra.
 *
 * npm run db:discover-releases
 * Requiere migración 003_new_releases.sql en Supabase
 */
import { getMergedReleases } from "../data/merge-releases";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const supabase = createAdminClient();

async function main() {
  const releases = getMergedReleases();
  console.log(`\n🆕 Makina Hub — ${releases.length} nuevas producciones (manual + Discogs)\n`);

  const { data: artists } = await supabase.from("artists").select("id, slug");
  const { data: labels } = await supabase.from("labels").select("id, slug");
  const byArtist = new Map((artists ?? []).map((a) => [a.slug, a.id]));
  const byLabel = new Map((labels ?? []).map((l) => [l.slug, l.id]));

  let ok = 0;

  for (const r of releases) {
    const artist_id = byArtist.get(r.artistSlug);
    if (!artist_id) {
      console.log(`⊘ ${r.title}: artista ${r.artistSlug} no en BD`);
      continue;
    }

    const label_id = r.labelSlug ? byLabel.get(r.labelSlug) ?? null : null;

    const row = {
      slug: r.slug,
      title: r.title,
      artist_id,
      label_id,
      release_date: r.releaseDate,
      purchase_url: r.purchaseUrl,
      store_name: r.storeName,
      cover_url: r.coverUrl ?? null,
      description: r.description ?? null,
      genre: r.genre ?? "makina",
      youtube_url: r.youtubeUrl ?? null,
      featured: true,
    };

    if (dryRun) {
      console.log(`· ${r.releaseDate} — ${r.title} → ${r.storeName}`);
      ok++;
      continue;
    }

    const { error } = await supabase.from("new_releases").upsert(row, {
      onConflict: "slug",
    });

    if (error) console.log(`✗ ${r.title}: ${error.message}`);
    else {
      console.log(`✓ ${r.title} (${r.storeName})`);
      ok++;
    }
  }

  const validSlugs = new Set(releases.map((r) => r.slug));
  if (!dryRun) {
    const { data: existing } = await supabase.from("new_releases").select("id, slug, title");
    const stale = (existing ?? []).filter(
      (e) => e.slug.startsWith("auto-discogs-") && !validSlugs.has(e.slug)
    );
    for (const row of stale) {
      await supabase.from("new_releases").delete().eq("id", row.id);
      console.log(`🗑 ${row.title}`);
    }
  }

  console.log(`\n✅ ${ok}/${releases.length}\n`);
}

main().catch((e) => {
  console.error(e);
  if (String(e).includes("new_releases")) {
    console.error("\n⚠️  Ejecuta supabase/migrations/003_new_releases.sql en Supabase SQL Editor\n");
  }
  process.exit(1);
});
