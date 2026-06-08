/**
 * Sincroniza image_url con el catálogo curado (data/artist-portraits.ts).
 *
 * npm run db:refresh-artist-images
 * npm run db:refresh-artist-images -- --dry-run
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { resolveCuratedPortraitUrl } from "../src/data/artist-portraits";
import {
  artistAvatarUrl,
  isTrustedArtistPhoto,
} from "../src/lib/artists/artist-image";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const supabase = createAdminClient();

async function main() {
  const { data: rows } = await supabase.from("artists").select("slug, name, image_url");
  const bySlug = new Map((rows ?? []).map((r) => [r.slug, r]));

  const targets = MAKINA_ARTISTS.filter((seed) => {
    const row = bySlug.get(seed.slug);
    if (!row) return true;
    if (resolveCuratedPortraitUrl(seed.slug)) return row.image_url !== resolveCuratedPortraitUrl(seed.slug);
    return !isTrustedArtistPhoto(seed.slug, row.image_url);
  });

  console.log(`\n🖼  Refresco de fotos — ${targets.length} artistas a actualizar\n`);

  let ok = 0;
  for (const seed of targets) {
    const portrait = resolveCuratedPortraitUrl(seed.slug);
    const image_url = portrait ?? artistAvatarUrl(seed.name);

    if (dryRun) {
      console.log(`${seed.name} → ${portrait ? "curado" : "avatar"}`);
      ok++;
      continue;
    }

    const { error } = await supabase
      .from("artists")
      .update({ image_url })
      .eq("slug", seed.slug);
    if (error) console.log(`ERROR ${seed.slug}: ${error.message}`);
    else {
      console.log(`${seed.name} → ${portrait ? "curado" : "avatar"}`);
      ok++;
    }
  }

  console.log(`\n✅ ${ok}/${targets.length} actualizados\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
