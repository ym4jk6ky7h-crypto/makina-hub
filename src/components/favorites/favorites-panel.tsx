"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { HomeSectionEmpty } from "@/components/ui/home-section-empty";
import { useFavorites } from "@/hooks/use-favorites";
import {
  FAVORITE_KIND_LABELS,
  type FavoriteKind,
  type FavoriteItem,
} from "@/lib/favorites/types";

const KIND_ORDER: FavoriteKind[] = [
  "event",
  "artist",
  "track",
  "session",
  "release",
];

function groupFavorites(items: FavoriteItem[]) {
  const groups = new Map<FavoriteKind, FavoriteItem[]>();
  for (const kind of KIND_ORDER) groups.set(kind, []);
  for (const item of items) {
    const list = groups.get(item.kind) ?? [];
    list.push(item);
    groups.set(item.kind, list);
  }
  return KIND_ORDER.filter((k) => (groups.get(k)?.length ?? 0) > 0).map((kind) => ({
    kind,
    items: groups.get(kind)!,
  }));
}

export function FavoritesPanel() {
  const { items, ready } = useFavorites();

  if (!ready) {
    return <p className="text-center text-muted-foreground">Cargando favoritos…</p>;
  }

  if (items.length === 0) {
    return (
      <HomeSectionEmpty
        icon={Heart}
        message="Aún no has guardado nada. Pulsa el corazón en artistas, eventos, canciones o sesiones."
        actionLabel="Explorar artistas"
        actionHref="/artistas"
      />
    );
  }

  const groups = groupFavorites(items);

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "elemento guardado" : "elementos guardados"} en
        este navegador.
      </p>
      {groups.map(({ kind, items: groupItems }) => (
        <section key={kind}>
          <h2 className="mb-4 text-lg font-bold">{FAVORITE_KIND_LABELS[kind]}</h2>
          <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-card/30">
            {groupItems.map((item) => (
              <li
                key={`${item.kind}-${item.id}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={item.href}
                    className="block font-semibold hover:text-makina-pink"
                  >
                    {item.title}
                  </Link>
                  {item.subtitle && (
                    <p className="truncate text-sm text-muted-foreground">{item.subtitle}</p>
                  )}
                </div>
                <FavoriteButton item={item} size="sm" />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Trash2 className="h-3.5 w-3.5" />
        Los favoritos se guardan solo en tu dispositivo (localStorage).
      </p>
    </div>
  );
}
