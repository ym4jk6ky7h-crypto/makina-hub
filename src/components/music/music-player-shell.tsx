"use client";

import { MusicPlayerProvider } from "@/contexts/music-player-context";
import { GlobalAudioBar } from "@/components/media/native-audio-player";

export function MusicPlayerShell({ children }: { children: React.ReactNode }) {
  return (
    <MusicPlayerProvider>
      {children}
      <GlobalAudioBar />
    </MusicPlayerProvider>
  );
}
