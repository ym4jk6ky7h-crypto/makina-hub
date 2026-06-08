import fs from "fs";
import path from "path";
import type { MakinaArtistSeed } from "../../data/makina-artists";
import { discogsSearchQuery } from "../../data/artist-discogs-queries";
import { formatArtistBiography } from "../../src/lib/artists/format-artist-biography";
import type { AiArtistEnrichment } from "./openai-artist";
import { fetchDiscogsArtist, type DiscogsResult } from "./discogs";
import { fetchMusicBrainzArtist, type MusicBrainzResult } from "./musicbrainz";
import {
  fetchSocialImages,
} from "./social-image";
import { resolveCuratedPortraitUrl } from "../../src/data/artist-portraits";
import { avatarFallback, fetchWikipediaArtistBest } from "./wikipedia";
import { fetchYouTubeForArtist } from "./youtube";

export type EnrichedArtist = {
  slug: string;
  name: string;
  real_name: string | null;
  biography: string;
  country: string;
  city: string;
  image_url: string;
  instagram_url: string | null;
  youtube_url: string | null;
  spotify_url: string | null;
  sources: string[];
};

export type EnrichOptions = {
  discogsToken?: string;
  youtubeApiKey?: string;
  skipMusicBrainz?: boolean;
};

const CACHE_PATH = path.join(__dirname, "../../data/ai-artist-cache.json");

function loadAiCache(slug: string): AiArtistEnrichment | null {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;
    const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as Record<
      string,
      AiArtistEnrichment
    >;
    return cache[slug] ?? null;
  } catch {
    return null;
  }
}

function mergeBiography(
  seed: MakinaArtistSeed,
  wiki: { extract: string; title: string; found: boolean },
  discogs: DiscogsResult,
  ai: AiArtistEnrichment | null
): string {
  const realName = ai?.realName ?? discogs.realName ?? null;

  return formatArtistBiography({
    name: seed.name,
    city: seed.city,
    country: seed.country,
    activeFrom: seed.activeFrom,
    classics: seed.classics,
    bio: seed.bio,
    realName,
    wikiExtract: wiki.found ? wiki.extract : undefined,
    wikiTitle: wiki.found ? wiki.title : undefined,
    discogsProfile: discogs.profile,
    ai,
  });
}

function wikiSearchTerms(seed: MakinaArtistSeed, ai: AiArtistEnrichment | null): string[] {
  return [
    seed.wikipediaSearch,
    seed.name,
    `${seed.name} DJ`,
    `${seed.name} mákina`,
    ...(ai?.imageSearchTerms ?? []),
  ];
}

async function pickImage(
  seed: MakinaArtistSeed,
  _wikiThumb: string | null,
  _discogsImg: string | null,
  _youtubeUrl: string | null,
  ai: AiArtistEnrichment | null
): Promise<{ url: string; sources: string[] }> {
  const imgSources: string[] = [];
  const curated = resolveCuratedPortraitUrl(seed.slug);
  if (curated) {
    imgSources.push("curated");
    return { url: curated, sources: imgSources };
  }

  const socialImg = await fetchSocialImages([
    ai?.instagramUrl,
    ai?.facebookUrl,
  ]);
  if (socialImg) {
    imgSources.push("social");
    return { url: socialImg, sources: imgSources };
  }

  imgSources.push("avatar");
  return { url: avatarFallback(seed.name), sources: imgSources };
}

/** Pipeline completo: bio curada + AI cache + Wikipedia + MusicBrainz + Discogs + imágenes */
export async function enrichArtistFull(
  seed: MakinaArtistSeed,
  opts: EnrichOptions = {}
): Promise<EnrichedArtist> {
  const sources: string[] = ["curated"];
  const ai = loadAiCache(seed.slug);
  if (ai) sources.push("openai");

  const wiki = await fetchWikipediaArtistBest(wikiSearchTerms(seed, ai));
  if (wiki.found) sources.push("wikipedia");

  let mb: MusicBrainzResult = {
    mbid: null,
    name: null,
    disambiguation: null,
    country: null,
    lifeSpan: null,
    youtubeUrl: null,
    spotifyUrl: null,
    discogsUrl: null,
    wikipediaUrl: null,
  };
  if (!opts.skipMusicBrainz) {
    mb = await fetchMusicBrainzArtist(seed.name);
    if (mb.mbid) sources.push("musicbrainz");
  }

  const discogs = await fetchDiscogsArtist(
    discogsSearchQuery(seed.slug, seed.name),
    seed.name,
    opts.discogsToken
  );
  if (discogs.id) sources.push("discogs");

  const yt = await fetchYouTubeForArtist(seed.name, opts.youtubeApiKey);
  if (yt.videoUrl) sources.push("youtube");

  const youtube_url = mb.youtubeUrl ?? yt.videoUrl ?? yt.searchUrl;
  const biography = mergeBiography(seed, wiki, discogs, ai);
  const { url: image_url, sources: imgSources } = await pickImage(
    seed,
    null,
    null,
    youtube_url,
    ai
  );
  sources.push(...imgSources);

  const spotify_url = mb.spotifyUrl ?? null;
  const real_name = ai?.realName ?? discogs.realName ?? null;
  const instagram_url = ai?.instagramUrl ?? null;

  return {
    slug: seed.slug,
    name: seed.name,
    real_name,
    biography,
    country: seed.country ?? "España",
    city: seed.city,
    image_url,
    instagram_url,
    youtube_url,
    spotify_url,
    sources,
  };
}

/** Solo biografía y nombre real — rápido, sin imágenes ni YouTube. */
export async function enrichArtistBioOnly(
  seed: MakinaArtistSeed,
  opts: Pick<EnrichOptions, "discogsToken"> = {}
): Promise<Pick<EnrichedArtist, "slug" | "real_name" | "biography" | "sources">> {
  const sources: string[] = ["curated"];
  const ai = loadAiCache(seed.slug);
  if (ai) sources.push("openai");

  const wiki = await fetchWikipediaArtistBest(wikiSearchTerms(seed, ai));
  if (wiki.found) sources.push("wikipedia");

  const discogs = await fetchDiscogsArtist(
    discogsSearchQuery(seed.slug, seed.name),
    seed.name,
    opts.discogsToken
  );
  if (discogs.id) sources.push("discogs");

  const biography = mergeBiography(seed, wiki, discogs, ai);
  const real_name = ai?.realName ?? discogs.realName ?? null;

  return { slug: seed.slug, real_name, biography, sources };
}
