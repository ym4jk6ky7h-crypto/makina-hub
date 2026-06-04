"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SEARCH_TABS, type SearchTab } from "@/lib/constants";
import { cn } from "@/lib/utils";

function buildHref(q: string, tab: SearchTab) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tab !== "todos") params.set("tab", tab);
  const s = params.toString();
  return s ? `/buscar?${s}` : "/buscar";
}

export function SearchTabs({ query }: { query: string }) {
  const searchParams = useSearchParams();
  const active = (searchParams.get("tab") as SearchTab | null) ?? "todos";

  return (
    <div
      className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      role="tablist"
      aria-label="Filtrar resultados"
    >
      {SEARCH_TABS.map((tab) => (
        <Link
          key={tab.id}
          href={buildHref(query, tab.id)}
          role="tab"
          aria-selected={active === tab.id}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            active === tab.id
              ? "border-makina-pink/50 bg-makina-pink/15 text-foreground"
              : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
