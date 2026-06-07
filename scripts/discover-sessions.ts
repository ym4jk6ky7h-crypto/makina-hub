/**
 * Sesiones mákina en YouTube — varios sets recientes por artista.
 * Orden en la web: youtube_published_at (fecha de subida a YouTube).
 *
 * npm run db:discover-sessions
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import {
  CURATED_SESSION_DURATION_SEC_BY_SLUG,
  CURATED_SESSION_WATCH_BY_SLUG,
} from "../src/data/curated-session-youtube";
import { youtubeVideoId } from "../src/lib/youtube";
import { secondsToMinutes } from "../src/lib/youtube-duration";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";
import { fetchRecentSessionsForArtist } from "./lib/youtube";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const youtubeKey = process.env.YOUTUBE_API_KEY;
const supabase = createAdminClient();

const SESSIONS_PER_ARTIST = 3;

async function upsertCuratedSessions(
  artist: { id: string; slug: string; name: string }
): Promise<number> {
  let count = 0;
  for (const [slug, url] of Object.entries(CURATED_SESSION_WATCH_BY_SLUG)) {
    if (!slug.startsWith(`${artist.slug}-`) && slug !== `${artist.slug}-sesion-makina`) {
      continue;
    }
    const videoId = youtubeVideoId(url);
    if (!videoId) continue;

    const durationMinutes = CURATED_SESSION_DURATION_SEC_BY_SLUG[slug]
      ? secondsToMinutes(CURATED_SESSION_DURATION_SEC_BY_SLUG[slug])
      : null;

    const row = {
      slug: `sesion-${videoId}`,
      title: `${artist.name} — Sesión mákina`,
      artist_id: artist.id,
      duration: durationMinutes,
      youtube_url: url,
      youtube_video_id: videoId,
      youtube_published_at: null as string | null,
      tracklist: [`${artist.name} — Sesión mákina`],
    };

    if (dryRun) {
      console.log(`· curado ${slug}`);
      count++;
      continue;
    }

    const { error } = await supabase.from("sessions").upsert(row, {
      onConflict: "slug",
    });
    if (error) console.log(`✗ curado ${slug}: ${error.message}`);
    else count++;
  }
  return count;
}

async function main() {
  const { data: artists } = await supabase.from("artists").select("id, slug, name");
  const bySlug = new Map((artists ?? []).map((a) => [a.slug, a]));

  console.log(
    `\n🎧 Makina Hub — sesiones YouTube (${MAKINA_ARTISTS.length} artistas, ${SESSIONS_PER_ARTIST} recientes c/u)\n`
  );
  if (!youtubeKey) {
    console.log("⚠️  Sin YOUTUBE_API_KEY: scraping (más lento, menos resultados).\n");
  }

  let ok = 0;

  for (const seed of MAKINA_ARTISTS) {
    const artist = bySlug.get(seed.slug);
    if (!artist) {
      console.log(`⊘ ${seed.name}: no en BD`);
      continue;
    }

    ok += await upsertCuratedSessions(artist);

    const recent = await fetchRecentSessionsForArtist(
      seed.name,
      youtubeKey,
      SESSIONS_PER_ARTIST
    );

    for (const session of recent) {
      const row = {
        slug: `sesion-${session.videoId}`,
        title: session.title,
        artist_id: artist.id,
        duration: session.durationMinutes,
        youtube_url: session.videoUrl,
        youtube_video_id: session.videoId,
        youtube_published_at: session.publishedAt,
        tracklist: seed.classics?.slice(0, 5) ?? [session.title],
      };

      if (dryRun) {
        console.log(`· ${seed.name} → ${session.title.slice(0, 50)}…`);
        ok++;
        continue;
      }

      const { error } = await supabase.from("sessions").upsert(row, {
        onConflict: "slug",
      });

      if (error) {
        console.log(`✗ ${seed.name}: ${error.message}`);
      } else {
        console.log(`✓ ${seed.name} — ${session.title.slice(0, 60)}`);
        ok++;
      }
    }

    await new Promise((r) => setTimeout(r, youtubeKey ? 350 : 100));
  }

  console.log(`\n✅ ${ok} sesiones sincronizadas\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
