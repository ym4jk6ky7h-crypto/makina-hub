import { createClient } from "@/lib/supabase/server";
import type { Artist, Event, EventWithRelations } from "@/types/database";

/** Hoy en Catalunya (YYYY-MM-DD) para filtrar eventos próximos */
export function todayMadridISO(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Madrid" });
}

function normalizeCityFilter(city?: string): string | undefined {
  if (!city || city === "all") return undefined;
  return city;
}

export async function listEvents(filters?: {
  city?: string;
  fromDate?: string;
  upcoming?: boolean;
  /** Por defecto solo eventos futuros */
  includePast?: boolean;
}): Promise<EventWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select(
      `
      *,
      event_artists(
        artists(*)
      )
    `
    )
    .order("event_date", { ascending: true });

  const city = normalizeCityFilter(filters?.city);
  if (city) query = query.eq("city", city);

  const onlyUpcoming = filters?.upcoming ?? !filters?.includePast;
  if (onlyUpcoming) {
    query = query.gte("event_date", todayMadridISO());
  }

  if (filters?.fromDate) query = query.gte("event_date", filters.fromDate);

  const { data, error } = await query;
  if (error) throw new Error(`events: ${error.message}`);

  return (data ?? []).map((row) => {
    const artists = (row.event_artists ?? [])
      .map((ea: { artists: Artist }) => ea.artists)
      .filter(Boolean);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { event_artists, ...event } = row;
    return { ...(event as Event), artists };
  });
}

export async function getEventBySlug(slug: string): Promise<EventWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      event_artists(
        artists(*)
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`events: ${error.message}`);
  if (!data) return null;

  const artists = (data.event_artists ?? [])
    .map((ea: { artists: Artist }) => ea.artists)
    .filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { event_artists, ...event } = data;
  return { ...(event as Event), artists };
}
