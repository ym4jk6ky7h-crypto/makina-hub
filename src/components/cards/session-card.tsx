import Image from "next/image";
import Link from "next/link";
import { Clock, Play, Youtube } from "lucide-react";
import { MakinaPlaceholder } from "@/components/ui/makina-placeholder";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { SessionWithRelations } from "@/types/database";
import { resolveSessionPlay } from "@/lib/session-play";
import { formatYoutubeDuration } from "@/lib/format-duration";
import { getSessionThumbnail } from "@/lib/session-thumbnail";

type SessionCardProps = {
  session: SessionWithRelations;
};

export function SessionCard({ session }: SessionCardProps) {
  const { videoId, durationSeconds } = resolveSessionPlay(session);
  const { url: thumb, fromYoutube } = getSessionThumbnail(session);
  const detailHref = videoId
    ? `/sesiones/${session.slug}#reproductor`
    : `/sesiones/${session.slug}`;

  return (
    <MediaCardShell accent="session" className="card-lift">
      <Link
        href={detailHref}
        className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-makina-purple/30 to-makina-pink/20"
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
            unoptimized={!fromYoutube}
          />
        ) : (
          <MakinaPlaceholder aspect="video" fill />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 transition-opacity group-hover:bg-black/35">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-xl shadow-red-900/50 ring-4 ring-white/20 transition-transform group-hover:scale-110">
            <Play className="h-7 w-7 fill-white text-white" />
          </div>
        </div>
        {durationSeconds != null && (
          <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">
            {formatYoutubeDuration(durationSeconds)}
          </span>
        )}
        {videoId && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            <Youtube className="h-3 w-3" />
            YouTube
          </span>
        )}
      </Link>

      <Link href={detailHref} className="flex flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug group-hover:text-makina-purple">
          {session.title}
        </h3>
        {session.artist?.name && (
          <p className="text-sm text-muted-foreground">{session.artist.name}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {durationSeconds != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatYoutubeDuration(durationSeconds)}
            </span>
          )}
          {session.youtube_published_at && (
            <span>
              {new Date(session.youtube_published_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </Link>
    </MediaCardShell>
  );
}
