import type { FavoriteInput, FavoriteItem } from "@/lib/favorites/types";

export const FAVORITES_STORAGE_KEY = "makina-hub-favorites-v1";
export const FAVORITES_CHANGE_EVENT = "makina-favorites-change";

function favoriteKey(kind: string, id: string) {
  return `${kind}:${id}`;
}

export function readFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeFavorites(items: FavoriteItem[]) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}

export function isFavorite(kind: string, id: string, items = readFavorites()) {
  const key = favoriteKey(kind, id);
  return items.some((f) => favoriteKey(f.kind, f.id) === key);
}

export function toggleFavorite(input: FavoriteInput): boolean {
  const items = readFavorites();
  const key = favoriteKey(input.kind, input.id);
  const exists = items.some((f) => favoriteKey(f.kind, f.id) === key);
  const next = exists
    ? items.filter((f) => favoriteKey(f.kind, f.id) !== key)
    : [{ ...input, addedAt: new Date().toISOString() }, ...items];
  writeFavorites(next);
  return !exists;
}

export function removeFavorite(kind: string, id: string) {
  const items = readFavorites().filter(
    (f) => favoriteKey(f.kind, f.id) !== favoriteKey(kind, id)
  );
  writeFavorites(items);
}
