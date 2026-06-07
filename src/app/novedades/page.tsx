import { ShoppingBag } from "lucide-react";
import { ReleaseCard } from "@/components/cards/release-card";
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

    return (
      <>
        <PageHero
          title="Novedades"
          subtitle="Últimos lanzamientos con enlace de compra en Beatport, Juno, Bandcamp y más."
          image={SITE_IMAGES.heroNovedades}
          badge={releases.length > 0 ? `${releases.length} recientes` : "Comprar"}
        />
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {releases.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Sin novedades con enlace de compra"
              description="Sincroniza lanzamientos curados con tienda digital."
              hint={
                <span className="block space-y-1 text-xs">
                  <span className="block">1. SQL: 003_new_releases.sql</span>
                  <span className="block">2. Terminal: npm run db:discover-releases</span>
                </span>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {releases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
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
