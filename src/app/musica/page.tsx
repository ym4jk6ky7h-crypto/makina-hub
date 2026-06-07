import Link from "next/link";
import { Suspense } from "react";
import { Headphones } from "lucide-react";
import { MusicCatalog } from "@/components/music/music-catalog";
import { PageHero } from "@/components/layout/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { listTracks } from "@/services/tracks.service";

export const metadata = buildMetadata({
  title: "Música",
  description:
    "Escucha temas mákina completos verificados — clásicos de los 90, remember y revival.",
  path: "/musica",
});

function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-16 animate-pulse rounded-full bg-white/10" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}

export default async function MusicaPage() {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales en CLAVES-SUPABASE.env. Reinicia npm run dev." />
    );
  }

  try {
    const tracks = await listTracks();

    return (
      <>
        <PageHero
          title="Música"
          subtitle="Temas completos verificados — clásicos de los 90, remember y revival."
          image={SITE_IMAGES.heroMusic}
          badge={`${tracks.length} temas`}
        />
        <div className="page-accent-music mx-auto max-w-7xl rounded-2xl border px-4 py-10 lg:px-8">
          {tracks.length > 0 ? (
            <Suspense fallback={<CatalogSkeleton />}>
              <MusicCatalog tracks={tracks} />
            </Suspense>
          ) : (
            <EmptyState
              icon={Headphones}
              title="Sin temas en el catálogo"
              description="Sincroniza el catálogo y cura enlaces YouTube mákina con npm run db:curate-tracks-youtube."
              hint={
                <code className="rounded bg-white/5 px-2 py-1 text-xs">
                  npm run db:curate-tracks-youtube
                </code>
              }
              compact
            />
          )}
          <p className="mt-10 text-center text-sm text-muted-foreground">
            ¿Buscas comprar lanzamientos nuevos?{" "}
            <Link href="/novedades" className="text-makina-cyan hover:underline">
              Ver novedades en tienda →
            </Link>
          </p>
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
