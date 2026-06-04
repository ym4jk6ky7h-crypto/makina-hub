import { ArtistCard } from "@/components/cards/artist-card";
import { PageHero } from "@/components/layout/page-hero";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { listArtists } from "@/services/artists.service";

export const metadata = buildMetadata({
  title: "Artistas",
  description:
    "Roster curado de DJs y productores de la escena mákina y remember catalana.",
  path: "/artistas",
});

export default async function ArtistasPage() {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales en CLAVES-SUPABASE.env. Reinicia npm run dev." />
    );
  }

  try {
    const artists = await listArtists();

    return (
      <>
        <PageHero
          title="Artistas"
          subtitle="Roster curado de la mákina y el remember — biografías, fotos y producciones."
          image={SITE_IMAGES.heroArtists}
          badge={`${artists.length} artistas`}
        />
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
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
