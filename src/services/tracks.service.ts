import { createClient } from "@/lib/supabase/server";
import type { Artist, Genre, Label, Track, TrackWithRelations } from "@/types/database";

const trackSelect = `
  *,
  artist:artists(*),
  label:labels(*)
`;

export async function listTracks(options?: {
  limit?: number;
  genre?: Genre;
}): Promise<TrackWithRelations[]> {
  const supabase = await createClient();
  let query = supabase.from("tracks").select(trackSelect).order("year", {
    ascending: false,
    nullsFirst: false,
  });
  if (options?.genre) query = query.eq("genre", options.genre);
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as TrackWithRelations[];
}

export async function getTrackBySlug(slug: string): Promise<TrackWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select(trackSelect)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const track = data as TrackWithRelations;

  const { data: similar, error: simErr } = await supabase
    .from("tracks")
    .select(trackSelect)
    .eq("genre", track.genre)
    .neq("id", track.id)
    .limit(4);
  if (simErr) throw simErr;

  return { ...track, similar: (similar ?? []) as TrackWithRelations[] };
}

export async function getTracksByArtistId(artistId: string): Promise<TrackWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select(trackSelect)
    .eq("artist_id", artistId)
    .order("year", { ascending: false });
  if (error) throw error;
  return (data ?? []) as TrackWithRelations[];
}

export type { Artist, Label, Track };
