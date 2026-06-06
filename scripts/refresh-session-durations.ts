/**
 * Actualiza duration en Supabase con la duración real del vídeo de YouTube enlazado.
 *
 * npm run db:refresh-session-durations
 * npm run db:refresh-session-durations -- --dry-run
 */
import {
  CURATED_SESSION_DURATION_SEC_BY_SLUG,
  CURATED_SESSION_WATCH_BY_SLUG,
} from "../src/data/curated-session-youtube";
import { secondsToMinutes } from "../src/lib/youtube-duration";
import { fetchVideoDurationSeconds } from "./lib/video-duration";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const apiKey = process.env.YOUTUBE_API_KEY;
const supabase = createAdminClient();

async function main() {
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, slug, title, youtube_url, duration");

  console.log(`\n⏱  Refresco de duraciones — ${sessions?.length ?? 0} sesiones\n`);

  let ok = 0;
  for (const session of sessions ?? []) {
    const curatedUrl = CURATED_SESSION_WATCH_BY_SLUG[session.slug];
    const curatedSec = CURATED_SESSION_DURATION_SEC_BY_SLUG[session.slug];
    const youtube_url = curatedUrl ?? session.youtube_url;

    let seconds =
      curatedSec ??
      (await fetchVideoDurationSeconds(youtube_url, apiKey));

    if (seconds == null) {
      console.log(`⊘ ${session.slug}: sin duración`);
      continue;
    }

    const minutes = secondsToMinutes(seconds);
    const label = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

    if (dryRun) {
      console.log(`${session.slug}: ${session.duration ?? "?"} → ${minutes} min (${label})`);
      ok++;
      continue;
    }

    const { error } = await supabase
      .from("sessions")
      .update({
        duration: minutes,
        ...(curatedUrl ? { youtube_url: curatedUrl } : {}),
      })
      .eq("id", session.id);

    if (error) console.log(`✗ ${session.slug}: ${error.message}`);
    else {
      console.log(`✓ ${session.slug}: ${minutes} min (${label})`);
      ok++;
    }

    await new Promise((r) => setTimeout(r, apiKey ? 120 : 400));
  }

  console.log(`\n✅ ${ok}/${sessions?.length ?? 0} actualizadas\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
