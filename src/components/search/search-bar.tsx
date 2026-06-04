"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  compact?: boolean;
  placeholder?: string;
};

export function SearchBar({
  compact = false,
  placeholder = "Buscar artistas, temas, eventos…",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
          compact ? "h-4 w-4" : "h-4 w-4"
        )}
      />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "border-white/10 bg-black/40 pl-9 backdrop-blur-sm focus-visible:ring-makina-pink/50",
          compact ? "h-9 text-sm" : "h-10"
        )}
      />
    </form>
  );
}
