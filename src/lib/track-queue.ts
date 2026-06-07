import type { MusicQueueItem } from "@/lib/music-player-types";
import { resolveTrackAudio } from "@/lib/track-audio";
import type { TrackWithRelations } from "@/types/database";

export function trackToQueueItem(track: TrackWithRelations): MusicQueueItem | null {
  const { audioUrl, downloadUrl, isPreview } = resolveTrackAudio(track);
  if (!audioUrl) return null;

  return {
    id: track.id,
    slug: track.slug,
    title: track.title,
    subtitle: track.artist?.name,
    audioUrl,
    artworkUrl: null,
    href: `/musica/${track.slug}`,
    downloadUrl,
    isPreview,
  };
}

export function buildQueueFromTracks(
  tracks: TrackWithRelations[]
): MusicQueueItem[] {
  return tracks
    .map(trackToQueueItem)
    .filter((t): t is MusicQueueItem => t != null);
}
