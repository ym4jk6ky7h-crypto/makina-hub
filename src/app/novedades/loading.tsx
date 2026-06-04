import { PageHeroSkeleton, ReleaseListSkeleton } from "@/components/loading/page-skeletons";

export default function NovedadesLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <ReleaseListSkeleton count={4} />
    </>
  );
}
