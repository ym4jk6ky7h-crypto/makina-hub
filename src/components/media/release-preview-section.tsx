"use client";

import {
  StickyAudioPlayer,
  YoutubeAudioPlayer,
} from "@/components/media/youtube-audio-player";

type ReleasePreviewSectionProps = {
  videoId: string;
  title: string;
  subtitle?: string;
  artworkUrl?: string | null;
  watchUrl?: string | null;
  badge?: string;
};

/** Preview de lanzamiento (novedades) — sigue usando YouTube como fuente externa. */
export function ReleasePreviewSection({
  videoId,
  title,
  subtitle,
  artworkUrl,
  watchUrl,
  badge,
}: ReleasePreviewSectionProps) {
  return (
    <>
      <div className={badge ? "" : "mb-6"}>
        <YoutubeAudioPlayer
          videoId={videoId}
          title={title}
          subtitle={subtitle}
          artworkUrl={artworkUrl}
          watchUrl={watchUrl}
          badge={badge}
        />
      </div>
      <StickyAudioPlayer
        videoId={videoId}
        title={title}
        subtitle={subtitle}
        watchUrl={watchUrl}
      />
    </>
  );
}
