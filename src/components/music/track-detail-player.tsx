"use client";

import { useEffect } from "react";
import { useMusicPlayer } from "@/contexts/music-player-context";
import { NativeAudioPlayer } from "@/components/media/native-audio-player";
import type { MusicQueueItem } from "@/lib/music-player-types";

type TrackDetailPlayerProps = {
  track: MusicQueueItem;
  queue: MusicQueueItem[];
  title: string;
  subtitle?: string;
  artworkUrl?: string | null;
  downloadUrl?: string | null;
  watchUrl?: string | null;
};

export function TrackDetailPlayer({
  track,
  queue,
  title,
  subtitle,
  artworkUrl,
  downloadUrl,
  watchUrl,
}: TrackDetailPlayerProps) {
  const { playTrack, current } = useMusicPlayer();

  useEffect(() => {
    if (!current || current.id !== track.id) {
      playTrack(track, queue);
    }
  }, [track.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NativeAudioPlayer
      trackId={track.id}
      title={title}
      subtitle={subtitle}
      artworkUrl={artworkUrl ?? track.artworkUrl}
      downloadUrl={downloadUrl}
      watchUrl={watchUrl}
    />
  );
}
