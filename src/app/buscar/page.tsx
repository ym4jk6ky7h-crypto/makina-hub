import Link from "next/link";
import { Suspense } from "react";
import { ArtistCard } from "@/components/cards/artist-card";
import { EventCard } from "@/components/cards/event-card";
import { TrackCard } from "@/components/cards/track-card";
import { SessionCard } from "@/components/cards/session-card";
import { VinylCard } from "@/components/cards/vinyl-card";
import { LabelCard } from "@/components/cards/label-card";
import { SearchBar } from "@/components/search/search-bar";
import { buildMetadata } from "@/lib/seo/metadata";
import { globalSearch } from "@/services/search.service";

export const metadata = buildMetadata({
  title: "Buscar",
  description:
    "Búsqueda global en artistas, temas, eventos, sesiones, vinilos y sellos.",
  path: "/buscar",
});

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

async function SearchResults({ query }: { query: string }) {
  const results = await globalSearch(query);
  const total =
    results.artists.length +
    results.tracks.length +
    results.events.length +
    results.sessions.length +
    results.vinyls.length +
    results.labels.length;

  if (total === 0) {
    return (
      <p className="mt-8 text-center text-muted-foreground">
        No se encontraron resultados para &quot;{query}&quot;
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {results.artists.length > 0 && (
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
      {results.tracks.length > 0 && (
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
      {results.events.length > 0 && (
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
      {results.sessions.length > 0 && (
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
      {results.vinyls.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Vinilos ({results.vinyls.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.vinyls.map((v) => (
              <VinylCard key={v.id} vinyl={v} />
            ))}
          </div>
        </section>
      )}
      {results.labels.length > 0 && (
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
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Buscar</h1>
      <p className="mt-2 text-muted-foreground">
        Artistas, canciones, eventos, sesiones, vinilos y sellos
      </p>
      <div className="mt-6 max-w-xl">
        <SearchBar placeholder={query || "Buscar en Makina Hub…"} />
      </div>

      {query ? (
        <Suspense fallback={<p className="mt-8 text-muted-foreground">Buscando…</p>}>
          <SearchResults query={query} />
        </Suspense>
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
