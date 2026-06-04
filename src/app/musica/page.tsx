import { ReleaseCard } from "@/components/cards/release-card";
import { TrackCard } from "@/components/cards/track-card";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeader } from "@/components/layout/section-header";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { listNewReleases } from "@/services/releases.service";
import { listTracks } from "@/services/tracks.service";

export const metadata = buildMetadata({
  title: "Música",
  description:
    "Nuevas producciones y catálogo de temas mákina con portada, BPM y enlaces de compra.",
  path: "/musica",
});

export default async function MusicaPage() {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales en CLAVES-SUPABASE.env. Reinicia npm run dev." />
    );
  }

  try {
    const [tracks, releases] = await Promise.all([
      listTracks(),
      listNewReleases({ limit: 12 }),
    ]);

    return (
      <>
        <PageHero
          title="Música"
          subtitle="Novedades con enlace de compra y catálogo de clásicos mákina."
          image={SITE_IMAGES.heroMusic}
          badge="Producciones"
        />
        <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 lg:px-8">
          {releases.length > 0 && (
            <section>
              <SectionHeader
                title="Nuevas producciones"
                href="/novedades"
                linkLabel="Ver todas"
              />
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {releases.map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionHeader title="Catálogo de temas" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
            {tracks.length === 0 && (
              <p className="mt-8 text-center text-muted-foreground">
                Sin temas en la base de datos. Ejecuta{" "}
                <code className="text-xs">npm run db:sync-all</code>.
              </p>
            )}
          </section>
        </div>
      </>
    );
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : formatSupabaseError(error);
    return <SetupRequired message={message} />;
  }
}
