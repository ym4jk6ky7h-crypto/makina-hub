export type FavoriteKind = "artist" | "event" | "track" | "session" | "release";

export type FavoriteItem = {
  kind: FavoriteKind;
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  href: string;
  addedAt: string;
};

export type FavoriteInput = Omit<FavoriteItem, "addedAt">;

export const FAVORITE_KIND_LABELS: Record<FavoriteKind, string> = {
  artist: "Artistas",
  event: "Eventos",
  track: "Canciones",
  session: "Sesiones",
  release: "Novedades",
};
