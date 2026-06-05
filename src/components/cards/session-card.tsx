import Image from "next/image";
import Link from "next/link";
import { Clock, Play, Youtube } from "lucide-react";
import { MakinaPlaceholder } from "@/components/ui/makina-placeholder";
import { MediaCardShell } from "@/components/ui/media-card-shell";
import type { SessionWithRelations } from "@/types/database";
import { resolveSessionPlay } from "@/lib/session-play";
import { getSessionThumbnail } from "@/lib/session-thumbnail";
import { cn } from "@/lib/utils";

type SessionCardProps = {
  session: SessionWithRelations;
};

export function SessionCard({ session }: SessionCardProps) {
  const { videoId, youtubeHref, isSearch, durationMinutes } = resolveSessionPlay(session);
  const { url: thumb, fromYoutube } = getSessionThumbnail(session);

  const detailHref = `/sesiones/${session.slug}`;

  return (
    <MediaCardShell>
      <Link
        href={detailHref}
        className="relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-makina-purple/30 to-makina-pink/20"
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
            unoptimized={!fromYoutube}
          />
        ) : (
          <MakinaPlaceholder aspect="video" fill />
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-4">
        <Link href={detailHref} className="block min-w-0">
          <h3 className="line-clamp-2 font-semibold leading-snug text-foreground group-hover:text-makina-pink">
            {session.title}
          </h3>
          {session.artist?.name && (
            <p className="mt-1 text-sm text-muted-foreground">{session.artist.name}</p>
          )}
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {(durationMinutes ?? session.duration) != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {durationMinutes ?? session.duration} min
            </span>
          )}
          {(videoId || youtubeHref) && (
            <span className="flex items-center gap-1 text-red-400">
              <Youtube className="h-3 w-3" />
              {videoId ? "Reproductor" : isSearch ? "Buscar" : "YouTube"}
            </span>
          )}
        </div>

        {videoId ? (
          <Link
            href={`${detailHref}#reproductor`}
            className={cn(
              "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white",
              "transition-colors hover:bg-red-500 sm:w-auto"
            )}
          >
            <Play className="h-4 w-4 fill-white" />
            Escuchar aquí
          </Link>
        ) : youtubeHref ? (
          <a
            href={youtubeHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white",
              "transition-colors hover:bg-red-500 sm:w-auto"
            )}
          >
            <Play className="h-4 w-4 fill-white" />
            Buscar en YouTube
          </a>
        ) : (
          <Link
            href={detailHref}
            className="mt-1 inline-flex w-full items-center justify-center rounded-lg border border-white/15 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 sm:w-auto"
          >
            Ver sesión
          </Link>
        )}
      </div>
    </MediaCardShell>
  );
}
