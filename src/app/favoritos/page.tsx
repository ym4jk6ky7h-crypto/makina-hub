import { FavoritesPanel } from "@/components/favorites/favorites-panel";
import { PageHero } from "@/components/layout/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = buildMetadata({
  title: "Mis favoritos",
  description: "Tus artistas, eventos, sesiones y novedades guardados en Makina Hub.",
  path: "/favoritos",
});

export default function FavoritosPage() {
  return (
    <>
      <PageHero
        title="Mis favoritos"
        subtitle="Guarda DJs, fiestas, sesiones y novedades para volver a ellos cuando quieras."
        image={SITE_IMAGES.heroHome}
        badge="Tu escena"
      />
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <FavoritesPanel />
      </div>
    </>
  );
}
