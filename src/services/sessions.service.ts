import { createClient } from "@/lib/supabase/server";
import type { SessionWithRelations } from "@/types/database";

const sessionSelect = `
  *,
  artist:artists(*)
`;

export async function listSessions(options?: {
  limit?: number;
}): Promise<SessionWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("sessions")
    .select(sessionSelect)
    .order("youtube_published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SessionWithRelations[];
}

export async function getSessionBySlug(
  slug: string
): Promise<SessionWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(sessionSelect)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as SessionWithRelations | null;
}
