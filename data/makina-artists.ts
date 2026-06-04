/**
 * Roster curado de la escena mákina / remember (84 artistas).
 * npm run db:discover-artists
 */
import { MAKINA_ARTIST_BIOS } from "./makina-artist-bios";
import { MAKINA_ARTISTS_META, type ArtistMeta } from "./makina-artists-meta";

export type MakinaArtistBio = {
  origins: string;
  peak: string;
  today: string;
};

export type MakinaArtistSeed = {
  name: string;
  slug: string;
  wikipediaSearch: string;
  city: string;
  country?: string;
  region?: "catalunya";
  activeFrom: number;
  venues?: string[];
  classics?: string[];
  bio: MakinaArtistBio;
};

function fallbackBio(name: string, city: string, from: number): MakinaArtistBio {
  return {
    origins: `${name} es DJ y productor vinculado a la escena mákina y remember, con base en ${city}. Su trayectoria arranca hacia ${from} en macrodiscotecas y salas especializadas de Catalunya.`,
    peak: `Entre ${from} y 2005, ${name} consolidó presencia en fiestas mákina, compilaciones y la escuela catalana de hard melódico y bouncy.`,
    today: `${name} sigue activo en Remember Tour, Makina Legends y eventos de revival de la old school catalana.`,
  };
}

function metaToSeed(meta: ArtistMeta): MakinaArtistSeed {
  const { country, region, ...rest } = meta;
  return {
    ...rest,
    country: country ?? "España",
    region: region ?? (country && country !== "España" ? undefined : "catalunya"),
    bio: MAKINA_ARTIST_BIOS[meta.slug] ?? fallbackBio(meta.name, meta.city, meta.activeFrom),
  };
}

export const MAKINA_ARTISTS: MakinaArtistSeed[] = MAKINA_ARTISTS_META.map(metaToSeed);

export const MAKINA_ARTIST_COUNT = MAKINA_ARTISTS.length;
