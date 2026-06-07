/**
 * Sincroniza nuevas producciones mákina con enlace de compra.
 *
 * npm run db:discover-releases
 * npm run db:discover-releases -- --dry-run
 * npm run db:discover-releases -- --curated-only
 * npm run db:discover-releases -- --skip-covers
 *
 * Requiere migración 003_new_releases.sql en Supabase
 */
import { MAKINA_NEW_RELEASES } from "../data/makina-new-releases";
import { getMergedReleases } from "../data/merge-releases";
import { normalizePurchaseUrl } from "../src/lib/normalize-purchase-url";
import { fetchReleaseCoverUrl } from "./lib/release-cover";
import { artistDisplayName, resolveArtistId } from "./lib/resolve-artist-id";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const curatedOnly = process.argv.includes("--curated-only");
const skipCovers = process.argv.includes("--skip-covers");
const supabase = createAdminClient();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const merged = getMergedReleases();
  const releases = curatedOnly
    ? MAKINA_NEW_RELEASES
    : merged.filter((r) => !curatedOnly || !r.slug.startsWith("auto-discogs-"));

  console.log(
    `\n🆕 Makina Hub — ${releases.length} novedades${curatedOnly ? " (solo curadas)" : " (manual + Discogs)"}\n`
  );

  const { data: artists } = await supabase.from("artists").select("id, slug");
  const { data: labels } = await supabase.from("labels").select("id, slug");
  const byArtist = new Map((artists ?? []).map((a) => [a.slug, a.id]));
  const byLabel = new Map((labels ?? []).map((l) => [l.slug, l.id]));

  let ok = 0;
  let skipped = 0;

  for (const r of releases) {
    const artist_id = resolveArtistId(r.artistSlug, byArtist);
    if (!artist_id) {
      console.log(`⊘ ${r.title}: artista «${r.artistSlug}» no en BD`);
      skipped++;
      continue;
    }

    const label_id = r.labelSlug ? byLabel.get(r.labelSlug) ?? null : null;
    const isAutoDiscogs = r.slug.startsWith("auto-discogs-");

    let coverUrl = r.coverUrl ?? null;
    if (!coverUrl && !skipCovers && !isAutoDiscogs) {
      const artistName = artistDisplayName(r.artistSlug);
      coverUrl = await fetchReleaseCoverUrl(artistName, r.title);
      if (coverUrl) console.log(`  🖼 portada iTunes: ${r.title}`);
      await sleep(350);
    }

    const row = {
      slug: r.slug,
      title: r.title,
      artist_id,
      label_id,
      release_date: r.releaseDate,
      purchase_url: normalizePurchaseUrl(r.purchaseUrl),
      store_name: r.storeName,
      cover_url: coverUrl,
      description: r.description ?? null,
      genre: r.genre ?? "makina",
      youtube_url: r.youtubeUrl ?? null,
      featured: !isAutoDiscogs,
    };

    if (dryRun) {
      console.log(
        `· ${r.releaseDate} — ${r.title} → ${r.storeName}${row.featured ? "" : " (archivo)"}`
      );
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

  console.log(`\n✅ ${ok}/${releases.length}${skipped ? ` (${skipped} omitidas por artista)` : ""}\n`);
}

main().catch((e) => {
  console.error(e);
  if (String(e).includes("new_releases")) {
    console.error("\n⚠️  Ejecuta supabase/migrations/003_new_releases.sql en Supabase SQL Editor\n");
  }
  process.exit(1);
});
