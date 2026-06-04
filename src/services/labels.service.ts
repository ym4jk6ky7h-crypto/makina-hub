import { createClient } from "@/lib/supabase/server";
import type { Artist, LabelWithRelations, Track, Vinyl } from "@/types/database";

export async function listLabels(): Promise<LabelWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("labels")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as LabelWithRelations[];
}

export async function getLabelBySlug(slug: string): Promise<LabelWithRelations | null> {
  const supabase = await createClient();
  const { data: label, error } = await supabase
    .from("labels")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!label) return null;

  const [tracksRes, vinylsRes] = await Promise.all([
    supabase
      .from("tracks")
      .select("*, artist:artists(*)")
      .eq("label_id", label.id)
      .order("year", { ascending: false }),
    supabase
      .from("vinyls")
      .select("*, artist:artists(*)")
      .eq("label_id", label.id),
  ]);

  if (tracksRes.error) throw tracksRes.error;
  if (vinylsRes.error) throw vinylsRes.error;

  const tracks = (tracksRes.data ?? []) as Track[];
  const artistIds = [...new Set(tracks.map((t) => t.artist_id))];

  let artists: Artist[] = [];
  if (artistIds.length > 0) {
    const { data: artistsData, error: aErr } = await supabase
      .from("artists")
      .select("*")
      .in("id", artistIds);
    if (aErr) throw aErr;
    artists = (artistsData ?? []) as Artist[];
  }

  return {
    ...(label as LabelWithRelations),
    tracks,
    vinyls: (vinylsRes.data ?? []) as Vinyl[],
    artists,
  };
}
