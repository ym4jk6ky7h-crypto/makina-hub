import { createClient } from "@/lib/supabase/server";
import { todayMadridISO } from "@/services/events.service";

export type HomeStats = {
  artists: number;
  eventsUpcoming: number;
  eventsThisMonth: number;
  tracks: number;
  sessions: number;
  releases: number;
};

function monthRangeISO(): { start: string; end: string } {
  const today = todayMadridISO();
  const [y, m] = today.split("-").map(Number);
  const start = `${y}-${String(m).padStart(2, "0")}-01`;
  const end =
    m === 12
      ? `${y + 1}-01-01`
      : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return { start, end };
}

export async function getHomeStats(): Promise<HomeStats> {
  const supabase = await createClient();
  const today = todayMadridISO();
  const { start, end } = monthRangeISO();

  const [artists, eventsUpcoming, eventsMonth, tracks, sessions, releases] =
    await Promise.all([
      supabase.from("artists").select("*", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("event_date", today),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("event_date", start)
        .lt("event_date", end),
      supabase.from("tracks").select("*", { count: "exact", head: true }),
      supabase.from("sessions").select("*", { count: "exact", head: true }),
      supabase.from("new_releases").select("*", { count: "exact", head: true }),
    ]);

  const critical = [artists, eventsUpcoming, eventsMonth, tracks, sessions];
  const firstError = critical.find((r) => r.error)?.error;
  if (firstError) throw new Error(`stats: ${firstError.message}`);

  return {
    artists: artists.count ?? 0,
    eventsUpcoming: eventsUpcoming.count ?? 0,
    eventsThisMonth: eventsMonth.count ?? 0,
    tracks: tracks.count ?? 0,
    sessions: sessions.count ?? 0,
    releases: releases.error ? 0 : (releases.count ?? 0),
  };
}
