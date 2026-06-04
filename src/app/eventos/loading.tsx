import {
  EventFiltersSkeleton,
  EventListSkeleton,
  PageHeroSkeleton,
} from "@/components/loading/page-skeletons";

export default function EventosLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <EventFiltersSkeleton />
      <EventListSkeleton count={5} />
    </>
  );
}
