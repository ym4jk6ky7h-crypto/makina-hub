import { createClient } from "@/lib/supabase/server";
import { normalizePurchaseUrl } from "@/lib/normalize-purchase-url";
import type { Artist, Label, NewRelease, NewReleaseWithRelations } from "@/types/database";

export const LATEST_RELEASES_LIMIT = 12;

function sortReleases(items: NewReleaseWithRelations[]): NewReleaseWithRelations[] {
  return [...items].sort((a, b) => b.release_date.localeCompare(a.release_date));
}

function mapRelease(row: NewReleaseWithRelations): NewReleaseWithRelations {
  return {
    ...row,
    purchase_url: normalizePurchaseUrl(row.purchase_url),
  };
}

function hasPurchaseLink(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const releaseSelect = `
  *,
  artist:artists(*),
  label:labels(*)
`;

export async function listNewReleases(options?: {
  limit?: number;
  /** Solo lanzamientos con enlace de compra (excluye detecciones Discogs sin tienda). */
  purchaseOnly?: boolean;
}): Promise<NewReleaseWithRelations[]> {
  const supabase = await createClient();
  const purchaseOnly = options?.purchaseOnly !== false;
  const limit = options?.limit ?? LATEST_RELEASES_LIMIT;

  let query = supabase
    .from("new_releases")
    .select(releaseSelect)
    .order("release_date", { ascending: false });

  if (purchaseOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(`new_releases: ${error.message}`);

  let rows = (data ?? []) as NewReleaseWithRelations[];

  if (purchaseOnly) {
    rows = rows.filter(
      (r) =>
        hasPurchaseLink(r.purchase_url) && !r.slug.startsWith("auto-discogs-")
    );
  }

  return sortReleases(rows.map(mapRelease)).slice(0, limit);
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
