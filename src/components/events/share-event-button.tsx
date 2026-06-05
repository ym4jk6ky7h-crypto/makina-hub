"use client";

import { ShareButton } from "@/components/share/share-button";

type ShareEventButtonProps = {
  title: string;
  slug: string;
  compact?: boolean;
};

export function ShareEventButton({ title, slug, compact = false }: ShareEventButtonProps) {
  return (
    <ShareButton title={title} path={`/eventos/${slug}`} compact={compact} />
  );
}
