import type { NewReleaseSeed } from "./makina-new-releases";
import { MAKINA_NEW_RELEASES } from "./makina-new-releases";
import { readJson } from "../scripts/lib/auto-store";

type AutoReleasesFile = { fetchedAt: string; releases: NewReleaseSeed[] };

export function getMergedReleases(): NewReleaseSeed[] {
  const auto = readJson<AutoReleasesFile>("fetched-releases.json", {
    fetchedAt: "",
    releases: [],
  });

  const bySlug = new Map<string, NewReleaseSeed>();
  for (const r of MAKINA_NEW_RELEASES) bySlug.set(r.slug, r);
  for (const r of auto.releases) bySlug.set(r.slug, r);

  return [...bySlug.values()].sort((a, b) =>
    b.releaseDate.localeCompare(a.releaseDate)
  );
}

export function getAutoReleaseSlugs(): Set<string> {
  const auto = readJson<AutoReleasesFile>("fetched-releases.json", { fetchedAt: "", releases: [] });
  return new Set(auto.releases.map((r) => r.slug));
}
