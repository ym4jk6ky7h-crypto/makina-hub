import { ReleaseCard } from "@/components/cards/release-card";
import { PageHero } from "@/components/layout/page-hero";
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
            <div className="glass-card rounded-2xl p-10 text-center">
              <p className="text-muted-foreground">
                Aún no hay lanzamientos en la base de datos.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ejecuta la migración{" "}
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
                  003_new_releases.sql
                </code>{" "}
                en Supabase y luego{" "}
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
                  npm run db:discover-releases
                </code>
                .
              </p>
            </div>
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
