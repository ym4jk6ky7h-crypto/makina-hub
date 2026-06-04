import { MAKINA_ARTISTS } from "./makina-artists";
import { MAKINA_CLASSIC_TRACKS, type ClassicTrackSeed } from "./makina-classic-tracks";
import { getAutoTracksForArtist } from "./merge-auto-tracks";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function sessionTracksFromSeed(seed: (typeof MAKINA_ARTISTS)[0]): ClassicTrackSeed[] {
  if (seed.venues?.length) {
    return seed.venues.slice(0, 3).map((venue, i) => ({
      title: `${venue} Session`,
      slug: slugify(`${venue}-session-${i}`),
      year: Math.min(seed.activeFrom + 2 + i, 2005),
      genre: "makina" as const,
      description: `Sesión en ${venue}.`,
    }));
  }
  return [
    {
      title: `${seed.name} — Remember Set`,
      slug: slugify(`${seed.name}-remember-set`),
      year: seed.activeFrom + 3,
      genre: "remember" as const,
      description: "Set remember de la escena catalana.",
    },
  ];
}

/** Temas curados + clásicos del seed + sesiones por sala si no hay más datos. */
export function getTracksForArtist(artistSlug: string): ClassicTrackSeed[] {
  const explicit = MAKINA_CLASSIC_TRACKS[artistSlug] ?? [];
  const seed = MAKINA_ARTISTS.find((a) => a.slug === artistSlug);
  if (!seed) return explicit;

  const existing = new Set(explicit.map((t) => t.title.toLowerCase()));
  const fromClassics = (seed.classics ?? [])
    .filter((title) => !existing.has(title.toLowerCase()))
    .map((title) => ({
      title,
      slug: slugify(title),
      genre: "makina" as const,
    }));

  let tracks = [...explicit, ...fromClassics];
  if (tracks.length === 0) {
    tracks = sessionTracksFromSeed(seed);
  }

  const titles = new Set(tracks.map((t) => t.title.toLowerCase()));
  for (const t of getAutoTracksForArtist(artistSlug)) {
    if (!titles.has(t.title.toLowerCase())) {
      tracks.push(t);
      titles.add(t.title.toLowerCase());
    }
  }

  return tracks;
}

/** Todos los artistas del catálogo tienen al menos una producción/sesión. */
export function getArtistSlugsWithTracks(): string[] {
  return MAKINA_ARTISTS.map((a) => a.slug);
}

export function getTotalTrackCount(): number {
  return MAKINA_ARTISTS.reduce((n, a) => n + getTracksForArtist(a.slug).length, 0);
}
