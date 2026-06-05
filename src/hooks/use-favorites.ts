"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FAVORITES_CHANGE_EVENT,
  isFavorite as checkFavorite,
  readFavorites,
  toggleFavorite as toggleStored,
} from "@/lib/favorites/storage";
import type { FavoriteInput, FavoriteItem } from "@/lib/favorites/types";

export function useFavorites() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setItems(readFavorites());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(FAVORITES_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(FAVORITES_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const isFavorite = useCallback(
    (kind: string, id: string) => checkFavorite(kind, id, items),
    [items]
  );

  const toggleFavorite = useCallback((input: FavoriteInput) => {
    return toggleStored(input);
  }, []);

  return { items, ready, isFavorite, toggleFavorite };
}
