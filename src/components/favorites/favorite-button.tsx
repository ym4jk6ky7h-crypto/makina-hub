"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import type { FavoriteInput } from "@/lib/favorites/types";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  item: FavoriteInput;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function FavoriteButton({
  item,
  showLabel = false,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { ready, isFavorite, toggleFavorite } = useFavorites();
  const saved = ready && isFavorite(item.kind, item.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(item)}
      disabled={!ready}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full border font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-makina-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        saved
          ? "border-makina-pink/50 bg-makina-pink/15 text-makina-pink"
          : "border-white/15 bg-white/5 text-muted-foreground hover:border-makina-pink/40 hover:text-makina-pink",
        size === "sm" ? "h-9 w-9" : showLabel ? "px-4 py-2 text-sm" : "h-10 w-10",
        className
      )}
      aria-pressed={saved}
      aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      <Heart className={cn("shrink-0", size === "sm" ? "h-4 w-4" : "h-5 w-5", saved && "fill-current")} />
      {showLabel && (saved ? "Guardado" : "Guardar")}
    </button>
  );
}
