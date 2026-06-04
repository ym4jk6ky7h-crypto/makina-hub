import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";
import { getVinylBySlug } from "@/services/vinyls.service";

const rarityLabels: Record<string, string> = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  legendary: "Legendario",
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const vinyl = await getVinylBySlug(slug);
  if (!vinyl) return {};
  return buildMetadata({
    title: `${vinyl.title} — ${vinyl.catalog_number}`,
    description: `Vinilo ${vinyl.artist?.name}. Valor: ${vinyl.estimated_value}€.`,
    path: `/vinilos/${slug}`,
    image: vinyl.cover_url ?? undefined,
  });
}

export default async function ViniloDetailPage({ params }: PageProps) {
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
                sizes="(max-width: 768px) 100vw, 50vw"
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
                href={`/artistas/${vinyl.artist.slug}`}
                className="mt-2 block text-lg text-makina-pink hover:underline"
              >
                {vinyl.artist.name}
              </Link>
            )}
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 py-2">
                <dt className="text-muted-foreground">Referencia</dt>
                <dd className="font-mono font-medium">{vinyl.catalog_number}</dd>
              </div>
              {vinyl.year && (
                <div className="flex justify-between border-b border-white/5 py-2">
                  <dt className="text-muted-foreground">Año</dt>
                  <dd>{vinyl.year}</dd>
                </div>
              )}
              {vinyl.label && (
                <div className="flex justify-between border-b border-white/5 py-2">
                  <dt className="text-muted-foreground">Sello</dt>
                  <dd>
                    <Link
                      href={`/sellos/${vinyl.label.slug}`}
                      className="hover:underline"
                    >
                      {vinyl.label.name}
                    </Link>
                  </dd>
                </div>
              )}
              {vinyl.estimated_value != null && (
                <div className="flex justify-between border-b border-white/5 py-2">
                  <dt className="text-muted-foreground">Valor estimado</dt>
                  <dd className="text-lg font-bold text-makina-gold">
                    {vinyl.estimated_value}€
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <Link
          href="/vinilos"
          className="mt-8 inline-block text-sm text-makina-pink hover:underline"
        >
          ← Volver a vinilos
        </Link>
      </div>
    </article>
  );
}
