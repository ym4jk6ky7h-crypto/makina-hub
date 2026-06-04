import { VinylCard } from "@/components/cards/vinyl-card";
import { PageHero } from "@/components/layout/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import { listVinyls } from "@/services/vinyls.service";

export const metadata = buildMetadata({
  title: "Vinilos",
  description:
    "Catálogo de vinilos mákina y remember con referencia, valor estimado y rareza.",
  path: "/vinilos",
});

export default async function VinilosPage() {
  const vinyls = await listVinyls();

  return (
    <>
      <PageHero
        title="Vinilos"
        subtitle="Referencias, valor de mercado y rareza de la escena mákina."
        image={SITE_IMAGES.heroVinyls}
        badge="Coleccionismo"
      />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {vinyls.map((vinyl) => (
            <VinylCard key={vinyl.id} vinyl={vinyl} />
          ))}
        </div>
      </div>
    </>
  );
}
