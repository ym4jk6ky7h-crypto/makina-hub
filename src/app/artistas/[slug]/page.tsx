import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistDetail } from "@/features/artists/artist-detail";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { parseParagraphs } from "@/lib/artists/artist-bio-utils";
import { getArtistImageUrl } from "@/lib/artists/artist-image";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import {
  getArtistBySlug,
  getArtistWithRelations,
} from "@/services/artists.service";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};
  const bioPreview =
    parseParagraphs(artist.biography ?? "")[0]?.slice(0, 160) ??
    `Artista de la escena mákina y remember catalana.`;
  return buildMetadata({
    title: artist.name,
    description: bioPreview,
    path: `/artistas/${slug}`,
    image: getArtistImageUrl(artist.name, artist.image_url, artist.slug),
  });
}

export default async function ArtistaDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales de Supabase en el entorno de despliegue." />
    );
  }

  try {
    const artistData = await getArtistWithRelations(slug);
    if (!artistData) notFound();

    return (
      <>
        <ArtistDetail artistData={artistData} />
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
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : formatSupabaseError(error);
    return <SetupRequired message={message} />;
  }
}
