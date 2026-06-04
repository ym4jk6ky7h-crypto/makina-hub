import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { resolveSessionPlay } from "@/lib/session-play";
import { youtubeThumbnail } from "@/lib/youtube";
import type { SessionWithRelations } from "@/types/database";

export function getSessionThumbnail(session: SessionWithRelations): {
  url: string | null;
  fromYoutube: boolean;
} {
  const { videoId, watchUrl } = resolveSessionPlay(session);
  const yt =
    youtubeThumbnail(watchUrl) ??
    youtubeThumbnail(session.youtube_url) ??
    (videoId ? youtubeThumbnail(`https://www.youtube.com/watch?v=${videoId}`) : null);

  if (yt) return { url: yt, fromYoutube: true };

  const artistUrl = session.artist
    ? getArtistImageUrl(session.artist.name, session.artist.image_url)
    : null;

  return { url: artistUrl, fromYoutube: false };
}
