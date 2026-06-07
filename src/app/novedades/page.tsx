import { ShoppingBag, Sparkles } from "lucide-react";
import { ReleaseCard } from "@/components/cards/release-card";
import { PageHero } from "@/components/layout/page-hero";
import { NovedadesCatalog } from "@/components/novedades/novedades-catalog";
import { EmptyState } from "@/components/ui/empty-state";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { LATEST_RELEASES_LIMIT, listNewReleases } from "@/services/releases.service";

export const metadata = buildMetadata({
  title: "Novedades",
  description:
    "Últimos lanzamientos de mákina y remember con enlace directo de compra.",
  path: "/novedades",
});

export default async function NovedadesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales en CLAVES-SUPABASE.env. Reinicia npm run dev." />
    );
  }

  try {
    const releases = await listNewReleases({ limit: LATEST_RELEASES_LIMIT });
    const [featured, ...rest] = releases;
    const storeCount = new Set(releases.map((r) => r.store_name)).size;

    return (
      <>
        <PageHero
          title="Novedades"
          subtitle="Lanzamientos recientes con enlace de compra en Beatport, Juno, Bandcamp y más."
          image={SITE_IMAGES.heroNovedades}
          badge={
            releases.length > 0
              ? `${releases.length} con enlace · ${storeCount} tiendas`
              : "Comprar"
          }
        />
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {releases.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Sin novedades con enlace de compra"
              description="Sincroniza el catálogo curado con tiendas digitales."
              hint={
                <span className="block space-y-1 text-xs">
                  <span className="block">1. SQL: 003_new_releases.sql</span>
                  <span className="block">2. Terminal: npm run db:discover-releases</span>
                </span>
              }
            />
          ) : (
            <div className="space-y-10">
              {featured && (
                <section aria-labelledby="featured-release">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-makina-pink" />
                    <h2
                      id="featured-release"
                      className="font-display text-lg font-bold tracking-tight"
                    >
                      Último lanzamiento
                    </h2>
                  </div>
                  <ReleaseCard release={featured} variant="featured" />
                </section>
              )}

              {rest.length > 0 && (
                <section aria-labelledby="all-releases">
                  <h2
                    id="all-releases"
                    className="mb-4 font-display text-lg font-bold tracking-tight"
                  >
                    Catálogo reciente
                  </h2>
                  <NovedadesCatalog releases={rest} />
                </section>
              )}
            </div>
          )}
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
