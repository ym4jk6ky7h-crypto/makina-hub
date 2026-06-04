import { createClient } from "@/lib/supabase/server";
import { normalizePurchaseUrl } from "@/lib/normalize-purchase-url";
import type { Artist, Label, NewRelease, NewReleaseWithRelations } from "@/types/database";

function sortReleases(items: NewReleaseWithRelations[]): NewReleaseWithRelations[] {
  return [...items].sort((a, b) => {
    const aCurated = !a.slug.startsWith("auto-discogs-");
    const bCurated = !b.slug.startsWith("auto-discogs-");
    if (aCurated !== bCurated) return aCurated ? -1 : 1;
    return b.release_date.localeCompare(a.release_date);
  });
}

function mapRelease(row: NewReleaseWithRelations): NewReleaseWithRelations {
  return {
    ...row,
    purchase_url: normalizePurchaseUrl(row.purchase_url),
  };
}

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

  const rows = (data ?? []) as NewReleaseWithRelations[];
  return sortReleases(rows.map(mapRelease));
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

  return mapRelease(data as NewReleaseWithRelations);
}

export type { Artist, Label, NewRelease };
