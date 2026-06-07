"use client";

import { Pause, Play } from "lucide-react";
import { useMusicPlayer } from "@/contexts/music-player-context";
import type { MusicQueueItem } from "@/lib/music-player-types";
import { cn } from "@/lib/utils";

type TrackPlayButtonProps = {
  track: MusicQueueItem;
  queue?: MusicQueueItem[];
  variant?: "card" | "pill" | "icon";
  className?: string;
  label?: string;
};

export function TrackPlayButton({
  track,
  queue,
  variant = "pill",
  className,
  label = "Escuchar",
}: TrackPlayButtonProps) {
  const { current, playing, playTrack, toggle } = useMusicPlayer();
  const isActive = current?.id === track.id;
  const isPlaying = isActive && playing;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) toggle();
    else playTrack(track, queue ?? [track]);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-makina-pink shadow-lg",
          "transition-transform hover:scale-105 motion-reduce:hover:scale-100",
          className
        )}
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 fill-white text-white" />
        ) : (
          <Play className="h-6 w-6 fill-white text-white" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold",
        "bg-makina-pink text-white transition-colors hover:bg-makina-pink/90",
        variant === "card" && "mt-1 w-full sm:w-auto",
        className
      )}
    >
      {isPlaying ? (
        <Pause className="h-4 w-4 fill-white" />
      ) : (
        <Play className="h-4 w-4 fill-white" />
      )}
      {isPlaying ? "Pausar" : label}
    </button>
  );
}
