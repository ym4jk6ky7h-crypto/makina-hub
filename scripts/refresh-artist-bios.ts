/**
 * Regenera biografías desde el catálogo curado + Wikipedia + Discogs + caché AI.
 * No toca imágenes ni enlaces sociales.
 *
 * npm run db:refresh-artist-bios
 * npm run db:refresh-artist-bios -- --dry-run
 * npm run db:refresh-artist-bios -- --limit=10
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { enrichArtistBioOnly } from "./lib/enrich-artist";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg
  ? parseInt(limitArg.split("=")[1], 10)
  : MAKINA_ARTISTS.length;

const supabase = createAdminClient();

async function main() {
  const artists = MAKINA_ARTISTS.slice(0, limit);
  console.log(`\n📖 Refresco de biografías — ${artists.length} artistas\n`);

  let ok = 0;
  for (let i = 0; i < artists.length; i++) {
    const seed = artists[i];
    process.stdout.write(`[${i + 1}/${artists.length}] ${seed.name}… `);

    const row = await enrichArtistBioOnly(seed, {
      discogsToken: process.env.DISCOGS_TOKEN,
    });

    if (dryRun) {
      console.log(row.sources.join("+"));
      ok++;
      continue;
    }

    const { error } = await supabase
      .from("artists")
      .update({ biography: row.biography, real_name: row.real_name })
      .eq("slug", seed.slug);

    if (error) console.log(`ERROR ${error.message}`);
    else {
      console.log(row.sources.join("+"));
      ok++;
    }
  }

  console.log(`\n✅ ${ok}/${artists.length} biografías actualizadas\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
