import { MAKINA_ARTISTS_META } from "../../data/makina-artists-meta";

const metaBySlug = new Map(MAKINA_ARTISTS_META.map((a) => [a.slug, a.name]));

/** Resuelve artist_id en BD a partir del slug del seed (con fallback parcial). */
export function resolveArtistId(
  artistSlug: string,
  byArtist: Map<string, string>
): string | undefined {
  const direct = byArtist.get(artistSlug);
  if (direct) return direct;

  for (const [slug, id] of byArtist) {
    if (slug.startsWith(`${artistSlug}-`) || artistSlug.startsWith(`${slug}-`)) {
      return id;
    }
  }

  return undefined;
}

export function artistDisplayName(artistSlug: string): string {
  return metaBySlug.get(artistSlug) ?? artistSlug.replace(/-/g, " ");
}
