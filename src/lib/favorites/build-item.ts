import type { FavoriteInput } from "@/lib/favorites/types";
import type { Artist, Event, NewRelease, Session } from "@/types/database";

export function favoriteFromArtist(artist: Pick<Artist, "id" | "slug" | "name">): FavoriteInput {
  return {
    kind: "artist",
    id: artist.id,
    slug: artist.slug,
    title: artist.name,
    href: `/artistas/${artist.slug}`,
  };
}

export function favoriteFromEvent(event: Pick<Event, "id" | "slug" | "title" | "city">): FavoriteInput {
  return {
    kind: "event",
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.city,
    href: `/eventos/${event.slug}`,
  };
}

export function favoriteFromSession(
  session: Pick<Session, "id" | "slug" | "title"> & { artist?: { name: string } | null }
): FavoriteInput {
  return {
    kind: "session",
    id: session.id,
    slug: session.slug,
    title: session.title,
    subtitle: session.artist?.name,
    href: `/sesiones/${session.slug}`,
  };
}

export function favoriteFromRelease(
  release: Pick<NewRelease, "id" | "slug" | "title"> & { artist?: { name: string } | null }
): FavoriteInput {
  return {
    kind: "release",
    id: release.id,
    slug: release.slug,
    title: release.title,
    subtitle: release.artist?.name,
    href: `/novedades/${release.slug}`,
  };
}
