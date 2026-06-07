import { createClient } from "@/lib/supabase/server";
import { MAKINA_LABELS_BY_SLUG } from "../../data/makina-labels";
import type { Artist, LabelWithRelations, NewReleaseWithRelations } from "@/types/database";

const releaseSelect = `
  *,
  artist:artists(*),
  label:labels(*)
`;

function labelLogoFallback(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=1a1020&color=e8b84a&bold=true&format=png`;
}

export async function listLabels(): Promise<LabelWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("labels").select("*").order("name");
  if (error) throw error;

  const rows = (data ?? []).map((row) => {
    const seed = MAKINA_LABELS_BY_SLUG.get(row.slug);
    return {
      ...(row as LabelWithRelations),
      description: seed?.description ?? row.description,
      logo_url: row.logo_url ?? labelLogoFallback(row.name),
    };
  });

  rows.sort((a, b) => {
    const aCurated = MAKINA_LABELS_BY_SLUG.has(a.slug) ? 0 : 1;
    const bCurated = MAKINA_LABELS_BY_SLUG.has(b.slug) ? 0 : 1;
    if (aCurated !== bCurated) return aCurated - bCurated;
    return a.name.localeCompare(b.name, "es");
  });

  return rows;
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

  const seed = MAKINA_LABELS_BY_SLUG.get(slug);

  const [releasesRes, artistsRes] = await Promise.all([
    supabase
      .from("new_releases")
      .select(releaseSelect)
      .eq("label_id", label.id)
      .eq("featured", true)
      .order("release_date", { ascending: false })
      .limit(8),
    seed?.artistSlugs?.length
      ? supabase.from("artists").select("*").in("slug", seed.artistSlugs)
      : Promise.resolve({ data: [] as Artist[], error: null }),
  ]);

  if (releasesRes.error) throw releasesRes.error;
  if (artistsRes.error) throw artistsRes.error;

  return {
    ...(label as LabelWithRelations),
    description: seed?.description ?? label.description,
    releases: (releasesRes.data ?? []) as NewReleaseWithRelations[],
    artists: (artistsRes.data ?? []) as Artist[],
    history: seed?.history,
    city: seed?.city,
    classics: seed?.classics,
    website: seed?.website,
  };
}

export type LabelDetail = NonNullable<Awaited<ReturnType<typeof getLabelBySlug>>>;
