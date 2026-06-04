import { ArtistGridSkeleton, PageHeroSkeleton } from "@/components/loading/page-skeletons";

export default function ArtistasLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <ArtistGridSkeleton />
    </>
  );
}
