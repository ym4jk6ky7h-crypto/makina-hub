/**
 * Descubre sesiones mákina en YouTube (búsqueda global, no solo roster de artistas).
 * Orden en la web: youtube_published_at.
 *
 * npm run db:discover-sessions
 * npm run db:discover-sessions -- --recent-days=14   (solo novedades, para cron diario)
 * npm run db:discover-sessions -- --max=300
 */
import { createAdminClient, loadEnv } from "./lib/supabase-admin";
import {
  artistNameMatches,
  fetchGlobalMakinaSessions,
} from "./lib/youtube";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const youtubeKey = process.env.YOUTUBE_API_KEY;
const supabase = createAdminClient();

const recentDaysArg = process.argv.find((a) => a.startsWith("--recent-days="));
const recentDays = recentDaysArg
  ? parseInt(recentDaysArg.split("=")[1], 10)
  : undefined;

const maxArg = process.argv.find((a) => a.startsWith("--max="));
const maxTotal = maxArg ? parseInt(maxArg.split("=")[1], 10) : 200;

const FALLBACK_SLUG = "sesiones-makina-varios";
const FALLBACK_NAME = "Sesiones mákina";

const MIGRATION_006_SQL = `-- Copiar en Supabase SQL Editor (NO el nombre del archivo)
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS youtube_published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS sessions_youtube_video_id_key
  ON sessions (youtube_video_id)
  WHERE youtube_video_id IS NOT NULL;`;

async function assertSessionSchema(): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .select("youtube_published_at, youtube_video_id")
    .limit(1);

  if (!error) return;

  if (error.message.includes("youtube_published_at") || error.message.includes("youtube_video_id")) {
    console.error(`
❌ Falta la migración 006 en Supabase.

NO pegues el nombre del archivo en el SQL Editor.
Copia y ejecuta SOLO esto:

────────── copiar desde aquí ──────────
${MIGRATION_006_SQL.trim()}
────────── hasta aquí ──────────

Luego vuelve a ejecutar: npm run db:discover-sessions
`);
    process.exit(1);
  }

  throw error;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function ensureFallbackArtist(): Promise<string> {
  const { data: existing } = await supabase
    .from("artists")
    .select("id")
    .eq("slug", FALLBACK_SLUG)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("artists")
    .insert({
      slug: FALLBACK_SLUG,
      name: FALLBACK_NAME,
      biography:
        "Sesiones de la escena mákina y remember encontradas en YouTube (DJ no identificado en catálogo).",
      country: "España",
      city: "Catalunya",
    })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}

function matchArtistId(
  title: string,
  channelTitle: string | null | undefined,
  artists: { id: string; name: string }[]
): string | null {
  const haystack = `${title} ${channelTitle ?? ""}`;
  const sorted = [...artists].sort((a, b) => b.name.length - a.name.length);
  for (const artist of sorted) {
    if (artistNameMatches(artist.name, haystack)) return artist.id;
  }
  return null;
}

async function main() {
  if (!dryRun) await assertSessionSchema();

  const { data: artists } = await supabase.from("artists").select("id, name, slug");
  const fallbackArtistId = dryRun ? "dry-run" : await ensureFallbackArtist();

  console.log(
    `\n🎧 Makina Hub — sesiones YouTube globales (max ${maxTotal}${
      recentDays ? `, últimos ${recentDays} días` : ", catálogo amplio"
    })\n`
  );
  if (!youtubeKey) {
    console.log("⚠️  Sin YOUTUBE_API_KEY: scraping limitado (menos resultados).\n");
  }

  const sessions = await fetchGlobalMakinaSessions(youtubeKey, {
    maxTotal,
    recentDays,
  });

  console.log(`Encontradas ${sessions.length} sesiones candidatas en YouTube.\n`);

  let ok = 0;
  let skipped = 0;

  for (const session of sessions) {
    const artistId =
      matchArtistId(session.title, session.channelTitle, artists ?? []) ??
      fallbackArtistId;

    const row = {
      slug: `sesion-${session.videoId}`,
      title: decodeHtmlEntities(session.title),
      artist_id: artistId,
      duration: session.durationMinutes,
      youtube_url: session.videoUrl,
      youtube_video_id: session.videoId,
      youtube_published_at: session.publishedAt,
      tracklist: [session.title],
    };

    if (dryRun) {
      console.log(`· ${session.title.slice(0, 70)}`);
      ok++;
      continue;
    }

    const { error } = await supabase.from("sessions").upsert(row, {
      onConflict: "slug",
    });

    if (error) {
      console.warn(`⚠ ${session.videoId}: ${error.message}`);
      skipped++;
    } else {
      console.log(`✓ ${session.title.slice(0, 72)}`);
      ok++;
    }
  }

  if (skipped > 0 && ok === 0) {
    console.error(
      "\n💡 Si todas fallaron, ejecuta la migración 006 en Supabase SQL Editor (ver mensaje al inicio del script).\n"
    );
  }

  console.log(`\n✅ ${ok} sesiones sincronizadas${skipped ? `, ${skipped} omitidas` : ""}.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
