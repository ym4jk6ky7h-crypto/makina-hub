import { CURATED_TRACK_DOWNLOAD_BY_SLUG } from "@/data/curated-track-audio";
import { CURATED_TRACK_WATCH_BY_SLUG } from "@/data/curated-track-youtube";
import { resolveTrackPlay } from "@/lib/track-play";
import { isDirectYoutubeWatch, youtubeThumbnail } from "@/lib/youtube";
import type { Genre, Track, TrackSourceType } from "@/types/database";

const MAKINA_GENRES: Genre[] = [
  "makina",
  "remember",
  "hardcore",
  "makina-revival",
  "bouncy",
  "hard-dance",
];

export type TrackAudioInput = Pick<
  Track,
  | "slug"
  | "genre"
  | "youtube_url"
  | "audio_url"
  | "preview_url"
  | "download_url"
  | "source_type"
  | "title"
  | "year"
>;

export type TrackPlaybackSource = "hosted" | "youtube" | null;

export type ResolvedTrackPlayback = {
  canPlay: boolean;
  audioUrl: string | null;
  videoId: string | null;
  watchUrl: string | null;
  artworkUrl: string | null;
  downloadUrl: string | null;
  source: TrackPlaybackSource;
  sourceType: TrackSourceType | null;
};

/** Solo temas completos: MP3 alojado o YouTube verificado (mákina). Sin previews iTunes. */
export function resolveTrackPlayback(
  track: TrackAudioInput
): ResolvedTrackPlayback {
  const downloadUrl =
    track.download_url?.trim() ||
    CURATED_TRACK_DOWNLOAD_BY_SLUG[track.slug] ||
    null;

  const hosted = track.audio_url?.trim() || null;
  const { videoId, watchUrl } = resolveTrackPlay({
    slug: track.slug,
    youtube_url: track.youtube_url,
  });

  const isCurated = Boolean(CURATED_TRACK_WATCH_BY_SLUG[track.slug]);
  const makinaGenre = MAKINA_GENRES.includes(track.genre);
  const verifiedYoutube =
    Boolean(videoId) &&
    (isCurated || (makinaGenre && isDirectYoutubeWatch(track.youtube_url)));

  const thumb =
    verifiedYoutube && videoId
      ? youtubeThumbnail(watchUrl ?? `https://www.youtube.com/watch?v=${videoId}`)
      : null;

  if (hosted) {
    return {
      canPlay: true,
      audioUrl: hosted,
      videoId: null,
      watchUrl: null,
      artworkUrl: thumb,
      downloadUrl,
      source: "hosted",
      sourceType: track.source_type ?? "hosted",
    };
  }

  if (verifiedYoutube && videoId) {
    return {
      canPlay: true,
      audioUrl: null,
      videoId,
      watchUrl,
      artworkUrl: thumb,
      downloadUrl,
      source: "youtube",
      sourceType: "external",
    };
  }

  return {
    canPlay: false,
    audioUrl: null,
    videoId: null,
    watchUrl: null,
    artworkUrl: thumb,
    downloadUrl,
    source: null,
    sourceType: null,
  };
}

/** @deprecated Usar resolveTrackPlayback */
export type ResolvedTrackAudio = ResolvedTrackPlayback & { isPreview: false };

export function resolveTrackAudio(track: TrackAudioInput): ResolvedTrackAudio {
  const pb = resolveTrackPlayback(track);
  return { ...pb, isPreview: false as const };
}

export function isTrackPlayable(track: TrackAudioInput): boolean {
  return resolveTrackPlayback(track).canPlay;
}

export type MusicDecade = "all" | "90s" | "2000s" | "2010s" | "revival";

export function trackDecade(year: number | null | undefined): MusicDecade {
  if (year == null) return "revival";
  if (year < 2000) return "90s";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "revival";
}

export function decadeLabel(decade: MusicDecade): string {
  const labels: Record<MusicDecade, string> = {
    all: "Todos",
    "90s": "90s",
    "2000s": "2000s",
    "2010s": "2010s",
    revival: "Revival",
  };
  return labels[decade];
}
