import { CURATED_TRACK_DOWNLOAD_BY_SLUG } from "@/data/curated-track-audio";
import type { Track, TrackSourceType } from "@/types/database";

export type TrackAudioInput = Pick<
  Track,
  | "slug"
  | "audio_url"
  | "preview_url"
  | "download_url"
  | "source_type"
  | "title"
  | "year"
>;

export type ResolvedTrackAudio = {
  audioUrl: string | null;
  downloadUrl: string | null;
  isPreview: boolean;
  sourceType: TrackSourceType | null;
};

export function resolveTrackAudio(track: TrackAudioInput): ResolvedTrackAudio {
  const audioUrl =
    track.audio_url?.trim() || track.preview_url?.trim() || null;

  const downloadUrl =
    track.download_url?.trim() ||
    CURATED_TRACK_DOWNLOAD_BY_SLUG[track.slug] ||
    null;

  const isPreview =
    !track.audio_url?.trim() &&
    Boolean(track.preview_url?.trim() || track.source_type === "itunes_preview");

  return {
    audioUrl,
    downloadUrl,
    isPreview,
    sourceType:
      track.source_type ?? (isPreview ? "itunes_preview" : audioUrl ? "hosted" : null),
  };
}

export function isTrackPlayable(track: TrackAudioInput): boolean {
  return Boolean(resolveTrackAudio(track).audioUrl);
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
