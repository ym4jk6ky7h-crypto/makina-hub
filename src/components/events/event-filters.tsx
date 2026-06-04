"use client";

import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { EVENT_CITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-makina-pink/50 bg-makina-pink/15 text-foreground shadow-sm shadow-makina-pink/10"
          : "border-white/10 bg-secondary/60 text-muted-foreground hover:border-white/20 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export function EventFilters({ sticky = true }: { sticky?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const city = searchParams.get("ciudad") ?? "all";
  const fecha = searchParams.get("fecha") ?? "upcoming";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const q = params.toString();
    router.push(q ? `/eventos?${q}` : "/eventos");
  }

  return (
    <div
      className={cn(
        sticky &&
          "sticky top-16 z-40 border-b border-white/5 bg-background/95 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Cuándo
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={fecha !== "all"}
              onClick={() => updateFilter("fecha", "upcoming")}
            >
              Próximos
            </FilterChip>
            <FilterChip
              active={fecha === "all"}
              onClick={() => updateFilter("fecha", "all")}
            >
              Toda la agenda
            </FilterChip>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-makina-cyan" />
            Ciudad
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            <FilterChip
              active={city === "all"}
              onClick={() => updateFilter("ciudad", "all")}
            >
              Todas
            </FilterChip>
            {EVENT_CITIES.map((c) => (
              <FilterChip
                key={c}
                active={city === c}
                onClick={() => updateFilter("ciudad", c)}
              >
                {c}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
