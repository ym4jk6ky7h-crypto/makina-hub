import Image from "next/image";
import Link from "next/link";
import { Headphones, Music2 } from "lucide-react";
import { PlayYoutubeButton } from "@/components/ui/play-youtube-button";
import { isDirectYoutubeWatch, youtubeThumbnail } from "@/lib/youtube";
import type { Session, Track, TrackWithRelations } from "@/types/database";

type ArtistListenNowProps = {
  artistName: string;
  tracks: Track[] | TrackWithRelations[];
  sessions: Session[];
};

type ListenItem =
  | { kind: "track"; track: Track | TrackWithRelations }
  | { kind: "session"; session: Session };

function pickListenItems(
  tracks: Track[] | TrackWithRelations[],
  sessions: Session[]
): ListenItem[] {
  const withYoutube = tracks.filter((t) => isDirectYoutubeWatch(t.youtube_url));
  const rest = tracks.filter((t) => !isDirectYoutubeWatch(t.youtube_url));
  const picked: ListenItem[] = [
    ...withYoutube.slice(0, 3).map((track) => ({ kind: "track" as const, track })),
    ...rest.slice(0, Math.max(0, 3 - withYoutube.length)).map((track) => ({
      kind: "track" as const,
      track,
    })),
  ].slice(0, 3);

  if (picked.length < 3) {
    const session = sessions.find((s) => isDirectYoutubeWatch(s.youtube_url));
    if (session) picked.push({ kind: "session", session });
  }

  return picked.slice(0, 3);
}

export function ArtistListenNow({
  artistName,
  tracks,
  sessions,
}: ArtistListenNowProps) {
  const items = pickListenItems(tracks, sessions);
  if (items.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-makina-pink/20 bg-gradient-to-br from-makina-pink/10 via-transparent to-makina-purple/10 p-5">
      <h2 className="mb-4 text-lg font-bold">Escuchar ahora</h2>
      <ul className="space-y-3">
        {items.map((item) => {
          if (item.kind === "track") {
            const { track } = item;
            const thumb = youtubeThumbnail(track.youtube_url);
            const playUrl = isDirectYoutubeWatch(track.youtube_url)
              ? track.youtube_url!
              : null;
            return (
              <li
                key={`track-${track.id}`}
                className="flex items-center gap-3 rounded-xl bg-black/25 p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {thumb ? (
                    <Image src={thumb} alt="" fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Music2 className="h-6 w-6 text-makina-pink" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/musica/${track.slug}`}
                    className="font-semibold hover:text-makina-pink"
                  >
                    {track.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{artistName}</p>
                </div>
                {playUrl ? (
                  <PlayYoutubeButton href={playUrl} size="sm" label="" />
                ) : (
                  <Link
                    href={`/musica/${track.slug}`}
                    className="text-xs text-makina-pink hover:underline"
                  >
                    Ver tema
                  </Link>
                )}
              </li>
            );
          }

          const { session } = item;
          const thumb = youtubeThumbnail(session.youtube_url);
          return (
            <li
              key={`session-${session.id}`}
              className="flex items-center gap-3 rounded-xl bg-black/25 p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                {thumb ? (
                  <Image src={thumb} alt="" fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Headphones className="h-6 w-6 text-makina-purple" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/sesiones/${session.slug}`}
                  className="font-semibold hover:text-makina-pink"
                >
                  {session.title}
                </Link>
                <p className="text-xs text-muted-foreground">Sesión</p>
              </div>
              {session.youtube_url && isDirectYoutubeWatch(session.youtube_url) && (
                <PlayYoutubeButton href={session.youtube_url} size="sm" label="" />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
