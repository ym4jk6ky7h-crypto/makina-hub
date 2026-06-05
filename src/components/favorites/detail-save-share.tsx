"use client";

import { FavoriteButton } from "@/components/favorites/favorite-button";
import { ShareButton } from "@/components/share/share-button";
import type { FavoriteInput } from "@/lib/favorites/types";

type DetailSaveShareProps = {
  item: FavoriteInput;
  shareTitle: string;
  sharePath: string;
};

export function DetailSaveShare({ item, shareTitle, sharePath }: DetailSaveShareProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <FavoriteButton item={item} showLabel />
      <ShareButton title={shareTitle} path={sharePath} compact />
    </div>
  );
}
