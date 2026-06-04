import { createClient } from "@/lib/supabase/server";
import type { GlobalSearchResults } from "@/types/database";

const trackSelect = `*, artist:artists(*), label:labels(*)`;
const sessionSelect = `*, artist:artists(*)`;
const vinylSelect = `*, artist:artists(*), label:labels(*)`;

export async function globalSearch(query: string): Promise<GlobalSearchResults> {
  const q = query.trim();
  if (!q) {
    return {
      artists: [],
      tracks: [],
      events: [],
      sessions: [],
      vinyls: [],
      labels: [],
    };
  }

  const supabase = await createClient();
  const pattern = `%${q}%`;

  const [artists, tracks, events, sessions, vinyls, labels] = await Promise.all([
    supabase
      .from("artists")
      .select("*")
      .or(`name.ilike.${pattern},biography.ilike.${pattern},city.ilike.${pattern}`)
      .limit(12),
    supabase
      .from("tracks")
      .select(trackSelect)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .limit(12),
    supabase
      .from("events")
      .select("*")
      .or(
        `title.ilike.${pattern},description.ilike.${pattern},city.ilike.${pattern},venue.ilike.${pattern}`
      )
      .limit(12),
    supabase
      .from("sessions")
      .select(sessionSelect)
      .ilike("title", pattern)
      .limit(12),
    supabase
      .from("vinyls")
      .select(vinylSelect)
      .or(`title.ilike.${pattern},catalog_number.ilike.${pattern}`)
      .limit(12),
    supabase
      .from("labels")
      .select("*")
      .or(`name.ilike.${pattern},description.ilike.${pattern}`)
      .limit(8),
  ]);

  const errors = [artists, tracks, events, sessions, vinyls, labels]
    .map((r) => r.error)
    .filter(Boolean);
  if (errors.length) throw errors[0];

  return {
    artists: artists.data ?? [],
    tracks: tracks.data ?? [],
    events: events.data ?? [],
    sessions: sessions.data ?? [],
    vinyls: vinyls.data ?? [],
    labels: labels.data ?? [],
  };
}
