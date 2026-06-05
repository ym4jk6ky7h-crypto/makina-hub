import { getTracksForArtist } from "../../../data/merge-classic-tracks";
import { CURATED_SESSION_WATCH_BY_SLUG } from "@/data/curated-session-youtube";
import type { Artist, Session, Track } from "@/types/database";

/** Sesión del roster aunque no esté aún en Supabase. */
export function ensureArtistSessions(
  artist: Pick<Artist, "id" | "slug" | "name">,
  sessions: Session[]
): Session[] {
  if (sessions.length > 0) return sessions;

  const youtube_url = CURATED_SESSION_WATCH_BY_SLUG[`${artist.slug}-sesion-makina`];
  if (!youtube_url) return [];

  return [
    {
      id: `curated-${artist.slug}-session`,
      slug: `${artist.slug}-sesion-makina`,
      title: `${artist.name} — Sesión mákina`,
      artist_id: artist.id,
      duration: 60,
      youtube_url,
      tracklist: [],
      created_at: new Date(0).toISOString(),
    },
  ];
}

/** Slugs de temas esperados para un artista (catálogo curado + auto). */
export function expectedTrackSlugsForArtist(artistSlug: string): string[] {
  return getTracksForArtist(artistSlug).map((t) => `${artistSlug}-${t.slug}`);
}

/** Combina temas de BD con búsqueda por slug si artist_id no devolvió filas. */
export function mergeArtistTracks(
  artistSlug: string,
  fromArtistId: Track[],
  fromSlugs: Track[]
): Track[] {
  const byId = new Map(fromArtistId.map((t) => [t.id, t]));
  for (const t of fromSlugs) byId.set(t.id, t);
  const merged = [...byId.values()];
  const expected = new Set(expectedTrackSlugsForArtist(artistSlug));
  return merged.sort((a, b) => {
    const aExp = expected.has(a.slug) ? 0 : 1;
    const bExp = expected.has(b.slug) ? 0 : 1;
    if (aExp !== bExp) return aExp - bExp;
    return (b.year ?? 0) - (a.year ?? 0);
  });
}
