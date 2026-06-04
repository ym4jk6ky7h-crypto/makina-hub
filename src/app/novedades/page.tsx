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
import { listNewReleases } from "@/services/releases.service";

export const metadata = buildMetadata({
  title: "Nuevas producciones",
  description:
    "Lanzamientos recientes de mákina y remember catalana. Compra en Beatport, Juno Download y más.",
  path: "/novedades",
});

export default async function NovedadesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales en CLAVES-SUPABASE.env. Reinicia npm run dev." />
    );
  }

  try {
    const releases = await listNewReleases();

    return (
      <>
        <PageHero
          title="Nuevas producciones"
          subtitle="Lanzamientos recientes de la escena mákina catalana. Cada ficha incluye enlace directo a la tienda de compra."
          image={SITE_IMAGES.heroNovedades}
          badge="Comprar"
        />
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {releases.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Sin novedades todavía"
              description="Crea la tabla en Supabase y sincroniza lanzamientos con enlace de compra."
              hint={
                <span className="block space-y-1 text-xs">
                  <span className="block">1. SQL: 003_new_releases.sql</span>
                  <span className="block">
                    2. Terminal: npm run db:discover-releases
                  </span>
                </span>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
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
