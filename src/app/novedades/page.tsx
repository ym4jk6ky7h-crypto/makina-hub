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
    const curated = releases.filter((r) => !r.slug.startsWith("auto-discogs-"));
    const discogs = releases.filter((r) => r.slug.startsWith("auto-discogs-"));

    return (
      <>
        <PageHero
          title="Nuevas producciones"
          subtitle="Lanzamientos curados con enlace a Beatport, Juno o Bandcamp. Abajo, detecciones recientes en Discogs (vinilos y digitales de la escena)."
          image={SITE_IMAGES.heroNovedades}
          badge={curated.length > 0 ? `${curated.length} curadas` : "Comprar"}
        />
        <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 lg:px-8">
          {releases.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Sin novedades todavía"
              description="Crea la tabla en Supabase y sincroniza lanzamientos con enlace de compra."
              hint={
                <span className="block space-y-1 text-xs">
                  <span className="block">1. SQL: 003_new_releases.sql</span>
                  <span className="block">2. Terminal: npm run db:discover-releases</span>
                </span>
              }
            />
          ) : (
            <>
              {curated.length > 0 && (
                <section>
                  <h2 className="mb-2 text-xl font-bold">Lanzamientos curados</h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Producciones mákina con enlace directo a tienda digital.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {curated.map((release) => (
                      <ReleaseCard key={release.id} release={release} />
                    ))}
                  </div>
                </section>
              )}

              {discogs.length > 0 && (
                <section>
                  <h2 className="mb-2 text-xl font-bold">Detectado en Discogs</h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Publicaciones recientes del artista en Discogs (pueden ser EPs,
                    compilaciones o reediciones — no siempre son «último single»).
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {discogs.slice(0, 24).map((release) => (
                      <ReleaseCard key={release.id} release={release} />
                    ))}
                  </div>
                </section>
              )}
            </>
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
