import type { ClassicTrackSeed } from "./makina-classic-tracks";
import { readJson } from "../scripts/lib/auto-store";
import type { AutoTrackSeed } from "../scripts/lib/fetchers/discogs-catalog";

type AutoTracksFile = { fetchedAt: string; tracks: AutoTrackSeed[] };

export function getAutoTracksForArtist(artistSlug: string): ClassicTrackSeed[] {
  const auto = readJson<AutoTracksFile>("fetched-tracks.json", {
    fetchedAt: "",
    tracks: [],
  });

  return auto.tracks
    .filter((t) => t.artistSlug === artistSlug)
    .map((t) => ({
      title: t.title,
      slug: t.slug.replace(/^auto-/, ""),
      year: t.year,
      genre: t.genre,
      description: t.description,
    }));
}

export function getAutoTrackSlugs(): Set<string> {
  const auto = readJson<AutoTracksFile>("fetched-tracks.json", { fetchedAt: "", tracks: [] });
  return new Set(auto.tracks.map((t) => `${t.artistSlug}-auto-${t.slug}`));
}
