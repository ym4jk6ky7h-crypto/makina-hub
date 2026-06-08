import { createAdminClient } from "@/lib/supabase/admin";
import {
  absoluteUrl,
  type DigestEvent,
  type DigestRelease,
  type DigestSession,
  type NewsletterDigest,
} from "@/lib/newsletter/digest";
import { SITE_URL } from "@/lib/constants";

function todayMadridISO(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Madrid" });
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export async function fetchNewsletterDigest(): Promise<NewsletterDigest> {
  const supabase = createAdminClient();
  const today = todayMadridISO();

  const [{ data: events }, { data: sessions }, { data: releases }] = await Promise.all([
    supabase
      .from("events")
      .select("title, slug, event_date, city")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(6),
    supabase
      .from("sessions")
      .select("title, slug, youtube_published_at, created_at")
      .order("youtube_published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("new_releases")
      .select("title, slug, artists(name)")
      .order("release_date", { ascending: false })
      .limit(4),
  ]);

  return {
    siteUrl: SITE_URL.replace(/\/$/, ""),
    events: (events ?? []).map(
      (e): DigestEvent => ({
        title: e.title,
        date: formatEventDate(e.event_date),
        city: e.city,
        href: absoluteUrl(`/eventos/${e.slug}`),
      })
    ),
    sessions: (sessions ?? []).map(
      (s): DigestSession => ({
        title: s.title,
        href: absoluteUrl(`/sesiones/${s.slug}`),
      })
    ),
    releases: (releases ?? []).map(
      (r): DigestRelease => ({
        title: r.title,
        artist: (r.artists as { name?: string } | null)?.name ?? "",
        href: absoluteUrl(`/novedades/${r.slug}`),
      })
    ),
  };
}

export function isDigestEmpty(digest: NewsletterDigest): boolean {
  return (
    digest.events.length === 0 &&
    digest.sessions.length === 0 &&
    digest.releases.length === 0
  );
}
