"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Headphones, Music2 } from "lucide-react";
import { TrackCard } from "@/components/cards/track-card";
import { SectionHeader } from "@/components/layout/section-header";
import { HomeSectionEmpty } from "@/components/ui/home-section-empty";
import {
  decadeLabel,
  resolveTrackAudio,
  trackDecade,
  type MusicDecade,
} from "@/lib/track-audio";
import { trackToQueueItem } from "@/lib/track-queue";
import type { Genre, TrackWithRelations } from "@/types/database";
import { cn } from "@/lib/utils";

const DECADES: MusicDecade[] = ["all", "90s", "2000s", "2010s", "revival"];

const GENRES: { id: Genre | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "makina", label: "Mákina" },
  { id: "remember", label: "Remember" },
  { id: "hardcore", label: "Hardcore" },
  { id: "makina-revival", label: "Revival" },
];

type MusicCatalogProps = {
  tracks: TrackWithRelations[];
};

export function MusicCatalog({ tracks }: MusicCatalogProps) {
  const searchParams = useSearchParams();
  const decade = (searchParams.get("decada") as MusicDecade) || "all";
  const genre = (searchParams.get("genero") as Genre | "all") || "all";

  const filtered = useMemo(() => {
    return tracks.filter((t) => {
      if (genre !== "all" && t.genre !== genre) return false;
      if (decade !== "all" && trackDecade(t.year) !== decade) return false;
      return true;
    });
  }, [tracks, decade, genre]);

  const playable = filtered.filter((t) => resolveTrackAudio(t).audioUrl);
  const classics = filtered.filter((t) => (t.year ?? 9999) < 2000);
  const recent = filtered.filter((t) => (t.year ?? 0) >= 2010);

  const queue = useMemo(
    () =>
      playable
        .map(trackToQueueItem)
        .filter((t): t is NonNullable<typeof t> => t != null),
    [playable]
  );

  function filterHref(nextDecade: MusicDecade, nextGenre: Genre | "all") {
    const params = new URLSearchParams();
    if (nextDecade !== "all") params.set("decada", nextDecade);
    if (nextGenre !== "all") params.set("genero", nextGenre);
    const q = params.toString();
    return q ? `/musica?${q}` : "/musica";
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        <span className="mr-1 self-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Década
        </span>
        {DECADES.map((d) => (
          <Link
            key={d}
            href={filterHref(d, genre)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              decade === d
                ? "border-makina-pink/50 bg-makina-pink/15 text-makina-pink"
                : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
            )}
          >
            {decadeLabel(d)}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="mr-1 self-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Género
        </span>
        {GENRES.map((g) => (
          <Link
            key={g.id}
            href={filterHref(decade, g.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              genre === g.id
                ? "border-makina-cyan/50 bg-makina-cyan/10 text-makina-cyan"
                : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
            )}
          >
            {g.label}
          </Link>
        ))}
      </div>

      {playable.length > 0 && (
        <p className="text-sm text-muted-foreground">
          <Music2 className="mr-1.5 inline h-4 w-4 text-makina-pink" />
          {playable.length} tema{playable.length !== 1 ? "s" : ""} listo
          {playable.length !== 1 ? "s" : ""} para escuchar en la app
          {playable.some((t) => resolveTrackAudio(t).isPreview)
            ? " (incluye previews)"
            : ""}
        </p>
      )}

      {decade === "all" && genre === "all" && classics.length > 0 && (
        <section>
          <SectionHeader
            title="Clásicos de los 90"
            subtitle="Remember y mákina de la edad de oro"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {classics.slice(0, 8).map((track) => (
              <TrackCard key={track.id} track={track} queue={queue} />
            ))}
          </div>
        </section>
      )}

      {decade === "all" && genre === "all" && recent.length > 0 && (
        <section>
          <SectionHeader
            title="Revival y reciente"
            subtitle="Nueva escena y reediciones"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recent.slice(0, 8).map((track) => (
              <TrackCard key={track.id} track={track} queue={queue} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          title={decade !== "all" || genre !== "all" ? "Resultados" : "Todo el catálogo"}
          badge={filtered.length > 0 ? String(filtered.length) : undefined}
        />
        {filtered.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((track) => (
              <TrackCard key={track.id} track={track} queue={queue} />
            ))}
          </div>
        ) : (
          <HomeSectionEmpty
            className="mt-6"
            icon={Headphones}
            message="Ningún tema coincide con estos filtros."
            actionLabel="Ver todo"
            actionHref="/musica"
          />
        )}
      </section>
    </div>
  );
}
