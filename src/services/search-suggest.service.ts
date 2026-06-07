import { createClient } from "@/lib/supabase/server";

export type SearchSuggestionItem = {
  type: "artist" | "release" | "event" | "session";
  label: string;
  sublabel?: string;
  href: string;
};

export async function searchSuggest(
  query: string,
  limit = 8
): Promise<SearchSuggestionItem[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const supabase = await createClient();
  const pattern = `%${q}%`;
  const perType = Math.max(2, Math.ceil(limit / 4));

  const [artists, releases, events, sessions] = await Promise.all([
    supabase
      .from("artists")
      .select("name, slug")
      .ilike("name", pattern)
      .limit(perType),
    supabase
      .from("new_releases")
      .select("title, slug, artist:artists(name)")
      .eq("featured", true)
      .ilike("title", pattern)
      .limit(perType),
    supabase
      .from("events")
      .select("title, slug, city")
      .ilike("title", pattern)
      .limit(perType),
    supabase
      .from("sessions")
      .select("title, slug")
      .ilike("title", pattern)
      .limit(perType),
  ]);

  const items: SearchSuggestionItem[] = [];

  for (const a of artists.data ?? []) {
    items.push({
      type: "artist",
      label: a.name,
      href: `/artistas/${a.slug}`,
    });
  }

  for (const r of releases.data ?? []) {
    const raw = r.artist as { name: string } | { name: string }[] | null;
    const artist = Array.isArray(raw) ? raw[0] : raw;
    items.push({
      type: "release",
      label: r.title,
      sublabel: artist?.name,
      href: `/novedades/${r.slug}`,
    });
  }

  for (const e of events.data ?? []) {
    items.push({
      type: "event",
      label: e.title,
      sublabel: e.city,
      href: `/eventos/${e.slug}`,
    });
  }

  for (const s of sessions.data ?? []) {
    items.push({
      type: "session",
      label: s.title,
      href: `/sesiones/${s.slug}`,
    });
  }

  return items.slice(0, limit);
}
