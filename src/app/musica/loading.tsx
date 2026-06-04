import { PageHeroSkeleton, TrackListSkeleton } from "@/components/loading/page-skeletons";

export default function MusicaLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <TrackListSkeleton count={9} />
    </>
  );
}
