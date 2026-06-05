import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistDetail } from "@/features/artists/artist-detail";
import { buildMetadata } from "@/lib/seo/metadata";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import { getArtistBySlug } from "@/services/artists.service";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};
  return buildMetadata({
    title: artist.name,
    description: (artist.biography ?? "").slice(0, 160),
    path: `/artistas/${slug}`,
    image: getArtistImageUrl(artist.name, artist.image_url, artist.slug),
  });
}

export default async function ArtistaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  return (
    <>
      <ArtistDetail slug={slug} />
      <div className="mx-auto max-w-5xl px-4 pb-8 lg:px-8">
        <Link
          href="/artistas"
          className="text-sm text-makina-pink hover:underline"
        >
          ← Volver a artistas
        </Link>
      </div>
    </>
  );
}
