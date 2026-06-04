import { PageHeroSkeleton, SessionGridSkeleton } from "@/components/loading/page-skeletons";

export default function SesionesLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <SessionGridSkeleton />
    </>
  );
}
