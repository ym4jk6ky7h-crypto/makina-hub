/**
 * Actualiza image_url solo para artistas con avatar genérico o URL no usable.
 *
 * npm run db:refresh-artist-images
 * npm run db:refresh-artist-images -- --dry-run
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { enrichArtistFull } from "./lib/enrich-artist";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const supabase = createAdminClient();

function isGenericAvatar(url: string | null | undefined): boolean {
  return !url || url.includes("ui-avatars.com");
}

async function main() {
  const { data: rows } = await supabase.from("artists").select("slug, name, image_url");
  const bySlug = new Map((rows ?? []).map((r) => [r.slug, r]));
  const targets = MAKINA_ARTISTS.filter((seed) => {
    const row = bySlug.get(seed.slug);
    return !row || isGenericAvatar(row.image_url);
  });

  console.log(`\n🖼  Refresco de fotos — ${targets.length} artistas sin foto real\n`);

  let ok = 0;
  for (const seed of targets) {
    process.stdout.write(`${seed.name}… `);
    const row = await enrichArtistFull(seed, {
      discogsToken: process.env.DISCOGS_TOKEN,
      youtubeApiKey: process.env.YOUTUBE_API_KEY,
      skipMusicBrainz: true,
    });

    if (isGenericAvatar(row.image_url)) {
      console.log("sin foto");
      continue;
    }

    if (dryRun) {
      console.log(row.image_url.slice(0, 60));
      ok++;
      continue;
    }

    const { error } = await supabase
      .from("artists")
      .update({ image_url: row.image_url })
      .eq("slug", seed.slug);
    if (error) console.log(`ERROR ${error.message}`);
    else {
      console.log(row.sources.filter((s) => s !== "curated").join("+") || "ok");
      ok++;
    }
  }

  console.log(`\n✅ ${ok}/${targets.length} actualizados\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
