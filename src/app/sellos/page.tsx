import { LabelCard } from "@/components/cards/label-card";
import { PageHero } from "@/components/layout/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import { listLabels } from "@/services/labels.service";

export const metadata = buildMetadata({
  title: "Sellos discográficos",
  description:
    "Bit Music, Max Music, Pont Aeri Records y más sellos de la mákina catalana.",
  path: "/sellos",
});

export default async function SellosPage() {
  const labels = await listLabels();

  return (
    <>
      <PageHero
        title="Sellos"
        subtitle="Historia, lanzamientos y artistas de los sellos mákina catalanes."
        image={SITE_IMAGES.heroLabels}
        badge="Discográficas"
      />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {labels.map((label) => (
            <LabelCard key={label.id} label={label} />
          ))}
        </div>
      </div>
    </>
  );
}
