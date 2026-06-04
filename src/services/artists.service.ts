import { createClient } from "@/lib/supabase/server";
import type { Artist, ArtistWithRelations, Event, Session, Track } from "@/types/database";

export async function listArtists(options?: { limit?: number }): Promise<Artist[]> {
  const supabase = await createClient();
  let query = supabase.from("artists").select("*").order("name");
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) throw new Error(`artists: ${error.message}`);
  return (data ?? []) as Artist[];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`artist: ${error.message}`);
  return data as Artist | null;
}

export async function getArtistWithRelations(
  slug: string
): Promise<ArtistWithRelations | null> {
  const artist = await getArtistBySlug(slug);
  if (!artist) return null;

  const supabase = await createClient();

  const [tracksRes, sessionsRes, eventsRes] = await Promise.all([
    supabase
      .from("tracks")
      .select("*")
      .eq("artist_id", artist.id)
      .order("year", { ascending: false }),
    supabase
      .from("sessions")
      .select("*")
      .eq("artist_id", artist.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("event_artists")
      .select("events(*)")
      .eq("artist_id", artist.id),
  ]);

  if (tracksRes.error) throw tracksRes.error;
  if (sessionsRes.error) throw sessionsRes.error;
  if (eventsRes.error) throw eventsRes.error;

  const events = (eventsRes.data ?? [])
    .map((row) => row.events as unknown as Event)
    .filter(Boolean);

  return {
    ...artist,
    tracks: (tracksRes.data ?? []) as Track[],
    sessions: (sessionsRes.data ?? []) as Session[],
    events,
  };
}
