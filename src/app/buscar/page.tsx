import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { ArtistCard } from "@/components/cards/artist-card";
import { HomeSectionEmpty } from "@/components/ui/home-section-empty";
import { EventCard } from "@/components/cards/event-card";
import { TrackCard } from "@/components/cards/track-card";
import { SessionCard } from "@/components/cards/session-card";
import { LabelCard } from "@/components/cards/label-card";
import { SearchBar } from "@/components/search/search-bar";
import { SearchExamples } from "@/components/search/search-examples";
import { SearchTabs } from "@/components/search/search-tabs";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SearchTab } from "@/lib/constants";
import { globalSearch } from "@/services/search.service";

export const metadata = buildMetadata({
  title: "Buscar",
  description:
    "Búsqueda global en artistas, temas, eventos, sesiones y sellos.",
  path: "/buscar",
});

type PageProps = {
  searchParams: Promise<{ q?: string; tab?: string }>;
};

const VALID_TABS = new Set([
  "todos",
  "artistas",
  "eventos",
  "musica",
  "sesiones",
  "sellos",
  "vinilos",
]);

function parseTab(tab?: string): SearchTab {
  if (tab && VALID_TABS.has(tab)) return tab as SearchTab;
  return "todos";
}

async function SearchResults({
  query,
  tab,
}: {
  query: string;
  tab: SearchTab;
}) {
  const results = await globalSearch(query);
  const show = (section: SearchTab) => tab === "todos" || tab === section;

  const sections: { key: SearchTab; count: number }[] = [
    { key: "artistas", count: results.artists.length },
    { key: "eventos", count: results.events.length },
    { key: "musica", count: results.tracks.length },
    { key: "sesiones", count: results.sessions.length },
    { key: "sellos", count: results.labels.length },
  ];
  const total = sections.reduce((n, s) => n + s.count, 0);
  const visibleTotal =
    tab === "todos"
      ? total
      : sections.find((s) => s.key === tab)?.count ?? 0;

  if (visibleTotal === 0) {
    return (
      <HomeSectionEmpty
        className="mt-8"
        icon={SearchX}
        message={`No se encontraron resultados para "${query}"${tab !== "todos" ? ` en ${tab}` : ""}.`}
        actionLabel="Ver artistas"
        actionHref="/artistas"
      />
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {show("artistas") && results.artists.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Artistas ({results.artists.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.artists.map((a) => (
              <ArtistCard key={a.id} artist={a} variant="row" />
            ))}
          </div>
        </section>
      )}
      {show("musica") && results.tracks.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Canciones ({results.tracks.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.tracks.map((t) => (
              <TrackCard key={t.id} track={t} />
            ))}
          </div>
        </section>
      )}
      {show("eventos") && results.events.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Eventos ({results.events.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {results.events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
      {show("sesiones") && results.sessions.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Sesiones ({results.sessions.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>
      )}
      {show("sellos") && results.labels.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Sellos ({results.labels.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.labels.map((l) => (
              <LabelCard key={l.id} label={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default async function BuscarPage({ searchParams }: PageProps) {
  const { q, tab: tabParam } = await searchParams;
  const query = q?.trim() ?? "";
  const tab = parseTab(tabParam);

  return (
    <div className="px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Buscar</h1>
      <p className="mt-2 text-muted-foreground">
        Artistas, canciones, eventos, sesiones y sellos
      </p>
      <div className="mt-6 max-w-xl">
        <SearchBar
          defaultQuery={query}
          placeholder={query || "Buscar en Makina Hub…"}
        />
      </div>

      {!query && <SearchExamples />}

      {query ? (
        <>
          <Suspense fallback={null}>
            <SearchTabs query={query} />
          </Suspense>
          <Suspense fallback={<p className="mt-8 text-muted-foreground">Buscando…</p>}>
            <SearchResults query={query} tab={tab} />
          </Suspense>
        </>
      ) : (
        <p className="mt-8 text-muted-foreground">
          Escribe para buscar en toda la base de datos.
        </p>
      )}

      <Link
        href="/ask"
        className="mt-8 inline-block text-sm text-makina-cyan hover:underline"
      >
        ¿Preguntas en lenguaje natural? Ask Makina AI →
      </Link>
    </div>
  );
}
