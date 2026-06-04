import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";
import { getVinylBySlug } from "@/services/vinyls.service";

const rarityLabels: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  legendary: "Legendary",
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const vinyl = await getVinylBySlug(slug);
  if (!vinyl) return {};
  return buildMetadata({
    title: `${vinyl.title} — ${vinyl.catalog_number}`,
    path: `/vinyl/${slug}`,
    image: vinyl.cover_url ?? undefined,
  });
}

export default async function VinylDetailPageEn({ params }: PageProps) {
  const { slug } = await params;
  const vinyl = await getVinylBySlug(slug);
  if (!vinyl) notFound();

  return (
    <article className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            {vinyl.cover_url && (
              <Image
                src={vinyl.cover_url}
                alt={vinyl.title}
                fill
                className="object-cover"
                sizes="50vw"
              />
            )}
          </div>
          <div>
            <Badge variant="outline" className="mb-4">
              {rarityLabels[vinyl.rarity]}
            </Badge>
            <h1 className="text-3xl font-bold">{vinyl.title}</h1>
            {vinyl.artist && (
              <Link
                href={`/artist/${vinyl.artist.slug}`}
                className="mt-2 block text-lg text-makina-pink hover:underline"
              >
                {vinyl.artist.name}
              </Link>
            )}
            <p className="mt-4 font-mono text-sm">{vinyl.catalog_number}</p>
            {vinyl.estimated_value != null && (
              <p className="mt-2 text-xl font-bold text-makina-gold">
                {vinyl.estimated_value}€
              </p>
            )}
          </div>
        </div>
        <Link href="/vinilos" className="mt-8 inline-block text-sm text-makina-pink hover:underline">
          ← Back to vinyls
        </Link>
      </div>
    </article>
  );
}
