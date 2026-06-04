import { createClient } from "@/lib/supabase/server";

/**
 * Construye contexto de BD para prompts de IA (Ask Makina, agentes).
 */
export async function buildDatabaseContextForAI(): Promise<string> {
  const supabase = await createClient();

  const [artists, tracks, events, sessions, labels, vinyls] = await Promise.all([
    supabase.from("artists").select("name, slug, city, biography").limit(30),
    supabase.from("tracks").select("title, slug, year, bpm, genre").limit(50),
    supabase.from("events").select("title, slug, event_date, city").limit(20),
    supabase.from("sessions").select("title, slug").limit(20),
    supabase.from("labels").select("name, slug").limit(10),
    supabase.from("vinyls").select("title, catalog_number, rarity").limit(20),
  ]);

  return JSON.stringify(
    {
      artists: artists.data,
      tracks: tracks.data,
      events: events.data,
      sessions: sessions.data,
      labels: labels.data,
      vinyls: vinyls.data,
    },
    null,
    2
  );
}
