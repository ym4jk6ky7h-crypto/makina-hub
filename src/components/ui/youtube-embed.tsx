import { youtubeEmbedUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

type YoutubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
};

export function YoutubeEmbed({ videoId, title, className }: YoutubeEmbedProps) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg shadow-black/40",
        className
      )}
    >
      <iframe
        src={youtubeEmbedUrl(videoId)}
        title={`Reproducir: ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
      />
    </div>
  );
}
