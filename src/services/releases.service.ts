import { createClient } from "@/lib/supabase/server";
import type { Artist, Label, NewRelease, NewReleaseWithRelations } from "@/types/database";

const releaseSelect = `
  *,
  artist:artists(*),
  label:labels(*)
`;

export async function listNewReleases(options?: {
  limit?: number;
  featured?: boolean;
}): Promise<NewReleaseWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("new_releases")
    .select(releaseSelect)
    .order("release_date", { ascending: false });

  if (options?.featured !== false) {
    query = query.eq("featured", true);
  }
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw new Error(`new_releases: ${error.message}`);

  return (data ?? []) as NewReleaseWithRelations[];
}

export async function getNewReleaseBySlug(
  slug: string
): Promise<NewReleaseWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("new_releases")
    .select(releaseSelect)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`new_releases: ${error.message}`);
  if (!data) return null;

  return data as NewReleaseWithRelations;
}

export type { Artist, Label, NewRelease };
