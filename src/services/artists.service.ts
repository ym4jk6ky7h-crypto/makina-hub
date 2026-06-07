import { ensureArtistSessions } from "@/lib/artists/artist-catalog";
import { createClient } from "@/lib/supabase/server";
import type { Artist, ArtistWithRelations, Event, Session, Track } from "@/types/database";

function sortTracksByYear(tracks: Track[]): Track[] {
  return [...tracks].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

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
      .order("youtube_published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("event_artists")
      .select("events(*)")
      .eq("artist_id", artist.id),
  ]);

  if (tracksRes.error) throw new Error(`tracks: ${tracksRes.error.message}`);
  if (sessionsRes.error) throw new Error(`sessions: ${sessionsRes.error.message}`);

  const tracks = sortTracksByYear((tracksRes.data ?? []) as Track[]);

  const sessions = ensureArtistSessions(
    artist,
    (sessionsRes.data ?? []) as Session[]
  );

  const events = eventsRes.error
    ? []
    : (eventsRes.data ?? [])
        .map((row) => row.events as unknown as Event)
        .filter(Boolean);

  return {
    ...artist,
    tracks,
    sessions,
    events,
  };
}
