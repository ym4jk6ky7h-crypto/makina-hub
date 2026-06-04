/**
 * Sesiones mákina en YouTube (una por artista del roster).
 * npm run db:discover-sessions
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { CURATED_SESSION_WATCH_BY_SLUG } from "../src/data/curated-session-youtube";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";
import { fetchYouTubeForArtist } from "./lib/youtube";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const youtubeKey = process.env.YOUTUBE_API_KEY;
const supabase = createAdminClient();

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

async function main() {
  const { data: artists } = await supabase.from("artists").select("id, slug, name");
  const bySlug = new Map((artists ?? []).map((a) => [a.slug, a]));

  console.log(`\n🎧 Makina Hub — sesiones YouTube (${MAKINA_ARTISTS.length} artistas)\n`);
  if (!youtubeKey) {
    console.log("⚠️  Sin YOUTUBE_API_KEY: se guardan enlaces de búsqueda YouTube (no vídeo directo).\n");
  }

  let ok = 0;

  for (const seed of MAKINA_ARTISTS) {
    const artist = bySlug.get(seed.slug);
    if (!artist) {
      console.log(`⊘ ${seed.name}: no en BD`);
      continue;
    }

    const title = `${seed.name} — Sesión mákina`;
    const slug = `${seed.slug}-sesion-makina`;
    const classic = seed.classics?.[0];
    const searchQ = classic
      ? `${seed.name} ${classic} makina remember sesion`
      : `${seed.name} makina remember DJ session`;
    const yt = await fetchYouTubeForArtist(seed.name, youtubeKey);
    const youtube_url =
      CURATED_SESSION_WATCH_BY_SLUG[slug] ??
      yt.videoUrl ??
      `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQ)}`;

    const row = {
      slug,
      title,
      artist_id: artist.id,
      duration: 60,
      youtube_url,
      tracklist: seed.classics?.slice(0, 5) ?? [title],
    };

    if (dryRun) {
      console.log(`· ${seed.name}`);
      ok++;
      continue;
    }

    const { error } = await supabase.from("sessions").upsert(row, { onConflict: "slug" });
    if (error) console.log(`✗ ${seed.name}: ${error.message}`);
    else {
      console.log(`✓ ${seed.name}`);
      ok++;
    }

    await new Promise((r) => setTimeout(r, youtubeKey ? 250 : 30));
  }

  if (!dryRun) {
    const validSlugs = new Set(MAKINA_ARTISTS.map((a) => `${a.slug}-sesion-makina`));
    const { data: existing } = await supabase.from("sessions").select("id, slug, title");
    const stale = (existing ?? []).filter((s) => !validSlugs.has(s.slug));
    for (const row of stale) {
      await supabase.from("sessions").delete().eq("id", row.id);
      console.log(`🗑 ${row.title}`);
    }
  }

  console.log(`\n✅ ${ok}/${MAKINA_ARTISTS.length} sesiones\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
