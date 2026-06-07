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
  isPreview?: boolean;
};

export function TrackDetailPlayer({
  track,
  queue,
  title,
  subtitle,
  artworkUrl,
  downloadUrl,
  isPreview,
}: TrackDetailPlayerProps) {
  const { playTrack, current } = useMusicPlayer();

  useEffect(() => {
    if (!current || current.id !== track.id) {
      playTrack(track, queue);
    }
  }, [track.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NativeAudioPlayer
      title={title}
      subtitle={subtitle}
      artworkUrl={artworkUrl}
      downloadUrl={downloadUrl}
      isPreview={isPreview}
    />
  );
}
