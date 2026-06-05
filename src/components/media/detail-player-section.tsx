import { ExternalLink } from "lucide-react";
import { StickyMiniPlayer } from "@/components/media/sticky-mini-player";
import { YoutubeEmbed } from "@/components/ui/youtube-embed";

type DetailPlayerSectionProps = {
  videoId: string;
  title: string;
  watchUrl?: string | null;
  subtitle?: string;
};

export function DetailPlayerSection({
  videoId,
  title,
  watchUrl,
  subtitle,
}: DetailPlayerSectionProps) {
  return (
    <>
      <div id="reproductor" className="mb-6 scroll-mt-24">
        <YoutubeEmbed videoId={videoId} title={title} />
        {watchUrl && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-makina-pink"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Abrir en YouTube
          </a>
        )}
      </div>
      <StickyMiniPlayer
        videoId={videoId}
        title={title}
        watchUrl={watchUrl}
        subtitle={subtitle}
      />
    </>
  );
}
