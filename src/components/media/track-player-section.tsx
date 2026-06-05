import {
  StickyAudioPlayer,
  YoutubeAudioPlayer,
} from "@/components/media/youtube-audio-player";

type TrackPlayerSectionProps = {
  videoId: string;
  title: string;
  subtitle?: string;
  artworkUrl?: string | null;
  watchUrl?: string | null;
  badge?: string;
};

export function TrackPlayerSection({
  videoId,
  title,
  subtitle,
  artworkUrl,
  watchUrl,
  badge,
}: TrackPlayerSectionProps) {
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
