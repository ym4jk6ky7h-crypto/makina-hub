/**
 * Inserta temas clásicos por artista y enriquece enlaces YouTube.
 *
 * npm run db:discover-tracks
 * npm run db:discover-tracks -- --dry-run
 * npm run db:discover-tracks -- --artist=pastis-buenri
 */
import {
  getArtistSlugsWithTracks,
  getTracksForArtist,
} from "../data/merge-classic-tracks";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";
import { fetchYouTubeForTrack } from "./lib/youtube";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const artistArg = process.argv.find((a) => a.startsWith("--artist="));
const onlyArtist = artistArg?.split("=")[1];
const youtubeKey = process.env.YOUTUBE_API_KEY;

const supabase = createAdminClient();

async function main() {
  const slugs = getArtistSlugsWithTracks().filter(
    (slug) => !onlyArtist || slug === onlyArtist
  );

  const { data: artists } = await supabase.from("artists").select("id, slug, name");
  const { data: labels } = await supabase.from("labels").select("id, slug");
  const bySlug = new Map((artists ?? []).map((a) => [a.slug, a]));
  const labelBySlug = new Map((labels ?? []).map((l) => [l.slug, l.id]));

  console.log(`\n🎵 Makina Hub — temas mákina catalanes (${slugs.length} artistas)\n`);

  let ok = 0;
  let total = 0;

  for (const artistSlug of slugs) {
    const artist = bySlug.get(artistSlug);
    if (!artist) {
      console.log(`⊘ ${artistSlug}: artista no en BD (ejecuta db:discover-artists)`);
      continue;
    }

    const tracks = getTracksForArtist(artistSlug);

    for (const t of tracks) {
      total++;
      const trackSlug = `${artistSlug}-${t.slug}`;

      let youtube_url = await fetchYouTubeForTrack(artist.name, t.title, youtubeKey);
      await new Promise((r) => setTimeout(r, youtubeKey ? 300 : 50));

      const label_id = t.labelSlug ? labelBySlug.get(t.labelSlug) ?? null : null;

      const row = {
        slug: trackSlug,
        title: t.title,
        artist_id: artist.id,
        year: t.year ?? null,
        bpm: t.bpm ?? null,
        genre: t.genre ?? "makina",
        youtube_url,
        description: t.description ?? null,
        label_id,
      };

      if (dryRun) {
        console.log(`· ${artist.name} — ${t.title}`);
        ok++;
        continue;
      }

      const { error } = await supabase.from("tracks").upsert(row, { onConflict: "slug" });
      if (error) console.log(`✗ ${t.title}: ${error.message}`);
      else {
        console.log(`✓ ${artist.name} — ${t.title}`);
        ok++;
      }
    }
  }

  console.log(`\n✅ ${ok}/${total} tracks\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
