import type { MusicQueueItem } from "@/lib/music-player-types";
import { resolveTrackPlayback } from "@/lib/track-audio";
import type { TrackWithRelations } from "@/types/database";

export function trackToQueueItem(track: TrackWithRelations): MusicQueueItem | null {
  const pb = resolveTrackPlayback(track);
  if (!pb.canPlay) return null;

  return {
    id: track.id,
    slug: track.slug,
    title: track.title,
    subtitle: track.artist?.name,
    audioUrl: pb.audioUrl,
    videoId: pb.videoId,
    watchUrl: pb.watchUrl,
    artworkUrl: pb.artworkUrl,
    href: `/musica/${track.slug}`,
    downloadUrl: pb.downloadUrl,
  };
}

export function buildQueueFromTracks(
  tracks: TrackWithRelations[]
): MusicQueueItem[] {
  return tracks
    .map(trackToQueueItem)
    .filter((t): t is MusicQueueItem => t != null);
}
