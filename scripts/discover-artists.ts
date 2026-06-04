/**
 * Descubre y enriquece el roster curado de artistas mákina (makina-artists.ts).
 * Fuentes: Wikipedia, MusicBrainz, Discogs (opcional), YouTube (opcional).
 *
 * npm run db:discover-artists
 * npm run db:discover-artists -- --limit=10
 * npm run db:discover-artists -- --dry-run
 * npm run db:discover-artists -- --skip-mb   (más rápido, solo wiki+discogs)
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { enrichArtistFull } from "./lib/enrich-artist";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const skipMb = process.argv.includes("--skip-mb");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg
  ? parseInt(limitArg.split("=")[1], 10)
  : MAKINA_ARTISTS.length;

const enrichOpts = {
  discogsToken: process.env.DISCOGS_TOKEN,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  skipMusicBrainz: skipMb,
};

const supabase = createAdminClient();

async function main() {
  const artists = MAKINA_ARTISTS.slice(0, limit);
  console.log(`\n🎧 Makina Hub — enriquecimiento de ${artists.length} artistas mákina\n`);
  console.log(
    "Fuentes:",
    ["Wikipedia", !skipMb && "MusicBrainz (~1s/artista)", enrichOpts.discogsToken && "Discogs", enrichOpts.youtubeApiKey && "YouTube"]
      .filter(Boolean)
      .join(" · "),
    "\n"
  );

  let ok = 0;

  for (let i = 0; i < artists.length; i++) {
    const seed = artists[i];
    process.stdout.write(`[${i + 1}/${artists.length}] ${seed.name}… `);

    const row = await enrichArtistFull(seed, enrichOpts);

    if (dryRun) {
      console.log(row.sources.join("+") || "seed");
      ok++;
      continue;
    }

    const { error } = await supabase.from("artists").upsert(
      {
        slug: row.slug,
        name: row.name,
        real_name: row.real_name,
        biography: row.biography,
        country: row.country,
        city: row.city,
        image_url: row.image_url,
        instagram_url: row.instagram_url,
        youtube_url: row.youtube_url,
        spotify_url: row.spotify_url,
      },
      { onConflict: "slug" }
    );

    if (error) console.log(`ERROR: ${error.message}`);
    else {
      console.log(`✓ ${row.sources.join(", ") || "avatar"}`);
      ok++;
    }
  }

  console.log(`\n✅ ${ok}/${artists.length} artistas en Supabase\n`);

  if (!dryRun && limit >= MAKINA_ARTISTS.length) {
    const validSlugs = new Set(MAKINA_ARTISTS.map((x) => x.slug));
    const { data: existing } = await supabase.from("artists").select("id, slug, name");
    const stale = (existing ?? []).filter((x) => !validSlugs.has(x.slug));
    if (stale.length) {
      console.log(`🗑️  Eliminando ${stale.length} artistas que ya no están en el roster…`);
      for (const row of stale) {
        const { error: delErr } = await supabase.from("artists").delete().eq("id", row.id);
        if (delErr) console.log(`  ✗ ${row.name}: ${delErr.message}`);
        else console.log(`  ✓ ${row.name}`);
      }
    }
  }

  if (!enrichOpts.discogsToken) {
    console.log("💡 Añade DISCOGS_TOKEN en CLAVES-SUPABASE.env para fotos y bios de Discogs\n");
  }
  if (!enrichOpts.youtubeApiKey) {
    console.log("💡 Añade YOUTUBE_API_KEY para enlaces de vídeo reales (sin key = búsqueda YouTube)\n");
  }
  if (dryRun) console.log("(dry-run)\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
