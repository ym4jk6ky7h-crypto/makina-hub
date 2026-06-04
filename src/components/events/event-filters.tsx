"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EVENT_CITIES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/eventos?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={searchParams.get("ciudad") ?? "all"}
        onValueChange={(v) => updateFilter("ciudad", v)}
      >
        <SelectTrigger className="w-[160px] bg-secondary/50">
          <SelectValue placeholder="Ciudad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las ciudades</SelectItem>
          {EVENT_CITIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("fecha") ?? "upcoming"}
        onValueChange={(v) => updateFilter("fecha", v)}
      >
        <SelectTrigger className="w-[160px] bg-secondary/50">
          <SelectValue placeholder="Fecha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="upcoming">Solo próximos</SelectItem>
          <SelectItem value="all">Toda la agenda</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
