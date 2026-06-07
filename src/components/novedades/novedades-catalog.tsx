"use client";

import { useMemo, useState } from "react";
import { Store } from "lucide-react";
import { ReleaseCard } from "@/components/cards/release-card";
import type { NewReleaseWithRelations } from "@/types/database";
import { cn } from "@/lib/utils";

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-makina-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-makina-pink/50 bg-makina-pink/15 text-foreground"
          : "border-white/10 bg-secondary/60 text-muted-foreground hover:border-white/20 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

type NovedadesCatalogProps = {
  releases: NewReleaseWithRelations[];
};

export function NovedadesCatalog({ releases }: NovedadesCatalogProps) {
  const stores = useMemo(() => {
    const names = [...new Set(releases.map((r) => r.store_name).filter(Boolean))];
    return names.sort((a, b) => a.localeCompare(b, "es"));
  }, [releases]);

  const [store, setStore] = useState<string>("all");

  const filtered =
    store === "all" ? releases : releases.filter((r) => r.store_name === store);

  return (
    <div className="space-y-6">
      {stores.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Store className="h-3.5 w-3.5 text-makina-cyan" />
            Tienda
          </span>
          <FilterChip active={store === "all"} onClick={() => setStore("all")}>
            Todas
          </FilterChip>
          {stores.map((name) => (
            <FilterChip key={name} active={store === name} onClick={() => setStore(name)}>
              {name}
            </FilterChip>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-muted-foreground">
          No hay lanzamientos en {store}. Prueba otra tienda.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      )}
    </div>
  );
}
