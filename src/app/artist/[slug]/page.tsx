import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

/** Ruta legacy en inglés → ficha en español */
export default async function ArtistLegacyRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/artistas/${slug}`);
}
