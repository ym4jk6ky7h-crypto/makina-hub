"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Headphones,
  Loader2,
  Mic2,
  Search,
  ShoppingBag,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import type { SearchSuggestionItem } from "@/services/search-suggest.service";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  compact?: boolean;
  placeholder?: string;
  defaultQuery?: string;
};

const TYPE_ICONS = {
  artist: Mic2,
  release: ShoppingBag,
  event: Calendar,
  session: Headphones,
} as const;

const TYPE_LABELS = {
  artist: "Artista",
  release: "Novedad",
  event: "Evento",
  session: "Sesión",
} as const;

export function SearchBar({
  compact = false,
  placeholder = "Buscar artistas, eventos, sesiones…",
  defaultQuery = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string, signal: AbortSignal) => {
    const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, {
      signal,
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { suggestions: SearchSuggestionItem[] };
    return data.suggestions ?? [];
  }, []);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      void fetchSuggestions(q, controller.signal)
        .then((items) => {
          if (!controller.signal.aborted) {
            setSuggestions(items);
            setOpen(items.length > 0);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) setSuggestions([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Search
          className={cn(
            "absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground",
            compact ? "h-4 w-4" : "h-4 w-4"
          )}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        <Input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) setOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          className={cn(
            "border-white/10 bg-black/40 pl-9 backdrop-blur-sm focus-visible:ring-makina-pink/50",
            compact ? "h-9 text-sm" : "h-10",
            loading && "pr-9"
          )}
        />
      </form>

      {open && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-background/98 py-1 shadow-xl backdrop-blur-xl"
          role="listbox"
        >
          {suggestions.map((item) => {
            const Icon = TYPE_ICONS[item.type];
            return (
              <li key={`${item.type}-${item.href}`}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
                >
                  <Icon className="h-4 w-4 shrink-0 text-makina-pink" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.label}</span>
                    {(item.sublabel || TYPE_LABELS[item.type]) && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.sublabel ?? TYPE_LABELS[item.type]}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="border-t border-white/5 px-3 py-2">
            <button
              type="button"
              className="w-full text-left text-xs font-medium text-makina-pink hover:underline"
              onClick={() => {
                const q = query.trim();
                setOpen(false);
                if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
              }}
            >
              Ver todos los resultados →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
