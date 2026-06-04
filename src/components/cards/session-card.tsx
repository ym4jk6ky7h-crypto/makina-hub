import Image from "next/image";
import Link from "next/link";
import { Clock, Youtube } from "lucide-react";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { MakinaPlaceholder } from "@/components/ui/makina-placeholder";
import { PlayThumbnailOverlay } from "@/components/ui/play-youtube-button";
import { PlayYoutubeButton } from "@/components/ui/play-youtube-button";
import type { SessionWithRelations } from "@/types/database";
import {
  isDirectYoutubeWatch,
  youtubeThumbnail,
  youtubeVideoId,
} from "@/lib/youtube";

type SessionCardProps = {
  session: SessionWithRelations;
};

export function SessionCard({ session }: SessionCardProps) {
  const thumb =
    youtubeThumbnail(session.youtube_url) ??
    (session.artist
      ? getArtistImageUrl(session.artist.name, session.artist.image_url)
      : null);
  const videoId = youtubeVideoId(session.youtube_url);
  const external = isDirectYoutubeWatch(session.youtube_url);
  const href = external && session.youtube_url
    ? session.youtube_url
    : `/sesiones/${session.slug}`;

  const inner = (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-makina-purple/30 to-makina-pink/20">
        {thumb ? (
          <Image
            src={thumb}
            alt={session.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
            unoptimized={!videoId}
          />
        ) : (
          <MakinaPlaceholder aspect="video" fill className="rounded-t-xl" />
        )}
        <PlayThumbnailOverlay className="opacity-100 transition-opacity sm:opacity-80 sm:group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{session.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{session.artist?.name}</p>
        {external && session.youtube_url && (
          <div className="mt-3 sm:hidden">
            <PlayYoutubeButton href={session.youtube_url} size="sm" label="Ver en YouTube" />
          </div>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          {session.duration != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {session.duration} min
            </span>
          )}
          {videoId && (
            <span className="flex items-center gap-1 text-red-400">
              <Youtube className="h-3 w-3" />
              YouTube
            </span>
          )}
        </div>
      </div>
    </>
  );

  const className =
    "group glass-card flex flex-col overflow-hidden transition-colors hover:bg-secondary/80";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
