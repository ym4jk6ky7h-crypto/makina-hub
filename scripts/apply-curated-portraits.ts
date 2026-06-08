/**
 * Aplica fotos verificadas del catálogo y avatar para el resto.
 * Elimina imágenes de Wikipedia/Discogs no curadas (homónimos incorrectos).
 *
 * npm run db:apply-portraits
 * npm run db:apply-portraits -- --dry-run
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { resolveCuratedPortraitUrl } from "../src/data/artist-portraits";
import { artistAvatarUrl } from "../src/lib/artists/artist-image";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const supabase = createAdminClient();

async function main() {
  console.log("\n🖼  Makina Hub — retratos curados\n");

  let curated = 0;
  let avatars = 0;

  for (const seed of MAKINA_ARTISTS) {
    const portrait = resolveCuratedPortraitUrl(seed.slug);
    const image_url = portrait ?? artistAvatarUrl(seed.name);

    if (portrait) curated++;
    else avatars++;

    if (dryRun) {
      console.log(
        `${portrait ? "✓" : "○"} ${seed.name} → ${portrait ? "curado" : "avatar"}`
      );
      continue;
    }

    const { error } = await supabase
      .from("artists")
      .update({ image_url })
      .eq("slug", seed.slug);

    if (error) console.log(`✗ ${seed.slug}: ${error.message}`);
    else
      console.log(
        `${portrait ? "✓" : "○"} ${seed.name}${portrait ? " (foto verificada)" : ""}`
      );
  }

  console.log(
    `\n✅ ${curated} con foto verificada · ${avatars} con avatar · ${MAKINA_ARTISTS.length} total\n`
  );
  console.log(
    "Añade más URLs en src/data/artist-portraits.ts (Discogs verificado) y vuelve a ejecutar.\n"
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
