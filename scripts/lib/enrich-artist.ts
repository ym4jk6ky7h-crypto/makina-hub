import fs from "fs";
import path from "path";
import type { MakinaArtistSeed } from "../../data/makina-artists";
import type { AiArtistEnrichment } from "./openai-artist";
import { fetchCommonsImageBest } from "./commons-image";
import { fetchDiscogsArtist, type DiscogsResult } from "./discogs";
import { fetchMusicBrainzArtist, type MusicBrainzResult } from "./musicbrainz";
import {
  fetchSocialImages,
  youtubeThumbnailFromUrl,
} from "./social-image";
import { CURATED_SESSION_WATCH_BY_SLUG } from "../../src/data/curated-session-youtube";
import { avatarFallback, fetchWikipediaArtistBest, upscaleWikiThumb } from "./wikipedia";
import { fetchYouTubeForArtist } from "./youtube";

function curatedSessionThumb(slug: string): string | null {
  const watch = CURATED_SESSION_WATCH_BY_SLUG[`${slug}-sesion-makina`];
  if (!watch) return null;
  const m = watch.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : null;
}

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
  wiki: string,
  discogs: DiscogsResult,
  mb: MusicBrainzResult,
  ai: AiArtistEnrichment | null
): string {
  const country = seed.country ?? "España";
  const venues = seed.venues?.length
    ? ` Ha actuado en ${seed.venues.join(", ")} y en el circuito Pont Aeri–Granollers–Chasis.`
    : "";

  const classics = [...new Set([...(ai?.productions ?? []), ...(seed.classics ?? [])])];
  const classicsLine = classics.length
    ? ` Entre sus referentes destacan ${classics.slice(0, 6).join(", ")}.`
    : "";

  const origins = ai?.extendedOrigins ?? seed.bio.origins;
  const peak = ai?.extendedPeak ?? seed.bio.peak;
  const today = ai?.extendedToday ?? seed.bio.today;

  const intro = `${seed.name} es DJ y productor de la escena mákina y remember catalana, con base en ${seed.city} (${country}). Lleva activo desde ${seed.activeFrom} y forma parte del sonido hard melódico que llenó macrodiscotecas y verbenas en los 90 y el revival actual.${venues}${classicsLine}`;

  return [intro, origins, peak, today].join("\n\n").slice(0, 6000);
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
  wikiThumb: string | null,
  discogsImg: string | null,
  youtubeUrl: string | null,
  ai: AiArtistEnrichment | null
): Promise<{ url: string; sources: string[] }> {
  const imgSources: string[] = [];

  if (discogsImg && !discogsImg.includes("spacer.gif")) {
    imgSources.push("discogs");
    return { url: discogsImg, sources: imgSources };
  }
  if (wikiThumb) {
    imgSources.push("wikipedia");
    return { url: wikiThumb, sources: imgSources };
  }

  const commons = await fetchCommonsImageBest(wikiSearchTerms(seed, ai));
  if (commons) {
    imgSources.push("commons");
    return { url: commons, sources: imgSources };
  }

  const socialImg = await fetchSocialImages([
    ai?.instagramUrl,
    ai?.facebookUrl,
  ]);
  if (socialImg) {
    imgSources.push("social");
    return { url: socialImg, sources: imgSources };
  }

  const ytThumb = youtubeThumbnailFromUrl(youtubeUrl);
  if (ytThumb) {
    imgSources.push("youtube");
    return { url: ytThumb, sources: imgSources };
  }

  const curatedThumb = curatedSessionThumb(seed.slug);
  if (curatedThumb) {
    imgSources.push("youtube-curated");
    return { url: curatedThumb, sources: imgSources };
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

  const discogs = await fetchDiscogsArtist(seed.name, opts.discogsToken);
  if (discogs.id) sources.push("discogs");

  const yt = await fetchYouTubeForArtist(seed.name, opts.youtubeApiKey);
  if (yt.videoUrl) sources.push("youtube");

  const youtube_url = mb.youtubeUrl ?? yt.videoUrl ?? yt.searchUrl;
  const biography = mergeBiography(seed, wiki.extract, discogs, mb, ai);
  const { url: image_url, sources: imgSources } = await pickImage(
    seed,
    upscaleWikiThumb(wiki.thumbnailUrl),
    discogs.imageUrl,
    youtube_url,
    ai
  );
  sources.push(...imgSources);

  const spotify_url = mb.spotifyUrl ?? null;
  const real_name = ai?.realName ?? discogs.realName ?? null;
  const instagram_url = ai?.instagramUrl ?? null;

  return {
    slug: seed.slug,
    name: discogs.name ?? seed.name,
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
