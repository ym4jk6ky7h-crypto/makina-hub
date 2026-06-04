import Image from "next/image";
import Link from "next/link";
import { Clock, Play, Youtube } from "lucide-react";
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
  const thumb = youtubeThumbnail(session.youtube_url);
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
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Youtube className="h-12 w-12 text-red-500/70" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{session.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{session.artist?.name}</p>
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
