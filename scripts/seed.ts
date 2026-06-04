/**
 * Seed Supabase via service role.
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Run: npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import {
  SEED_ARTISTS,
  SEED_LABELS,
  buildSeedTracks,
  buildSeedEvents,
  buildSeedSessions,
  buildSeedVinyls,
  buildEventArtists,
} from "./seed-data";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function truncate() {
  await supabase.from("event_artists").delete().neq("event_id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("vinyls").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("tracks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("labels").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("artists").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

async function main() {
  console.log("Seeding Makina Hub…");
  await truncate();

  const { error: lErr } = await supabase.from("labels").insert([...SEED_LABELS]);
  if (lErr) throw lErr;

  const { error: aErr } = await supabase.from("artists").insert([...SEED_ARTISTS]);
  if (aErr) throw aErr;

  const tracks = buildSeedTracks();
  const { error: tErr } = await supabase.from("tracks").insert(tracks);
  if (tErr) throw tErr;

  const events = buildSeedEvents();
  const { error: eErr } = await supabase.from("events").insert(events);
  if (eErr) throw eErr;

  const sessions = buildSeedSessions();
  const { error: sErr } = await supabase.from("sessions").insert(sessions);
  if (sErr) throw sErr;

  const vinyls = buildSeedVinyls();
  const { error: vErr } = await supabase.from("vinyls").insert(vinyls);
  if (vErr) throw vErr;

  const { error: eaErr } = await supabase.from("event_artists").insert(buildEventArtists());
  if (eaErr) throw eaErr;

  console.log("Done:", {
    labels: SEED_LABELS.length,
    artists: SEED_ARTISTS.length,
    tracks: tracks.length,
    events: events.length,
    sessions: sessions.length,
    vinyls: vinyls.length,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
