import { createClient } from "@/lib/supabase/server";
import type { VinylWithRelations } from "@/types/database";

const vinylSelect = `
  *,
  artist:artists(*),
  label:labels(*)
`;

export async function listVinyls(): Promise<VinylWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vinyls")
    .select(vinylSelect)
    .order("year", { ascending: false });
  if (error) throw error;
  return (data ?? []) as VinylWithRelations[];
}

export async function getVinylBySlug(slug: string): Promise<VinylWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vinyls")
    .select(vinylSelect)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as VinylWithRelations | null;
}
