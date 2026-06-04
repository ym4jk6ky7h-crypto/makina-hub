import { Skeleton } from "@/components/ui/skeleton";

export function PageHeroSkeleton() {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="relative mx-auto max-w-7xl space-y-4 px-4 py-12 lg:px-8 lg:py-16">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-10 w-64 max-w-full sm:h-12 sm:w-96" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-5 w-2/3 max-w-md" />
      </div>
    </section>
  );
}

export function EventFiltersSkeleton() {
  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-background/95 px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card grid gap-4 rounded-2xl p-4 sm:grid-cols-[180px_1fr]"
        >
          <Skeleton className="hidden aspect-[3/4] rounded-xl sm:block" />
          <div className="flex gap-4 sm:flex-row">
            <Skeleton className="aspect-[3/4] w-full shrink-0 rounded-xl sm:w-44" />
            <div className="flex flex-1 flex-col gap-3 py-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArtistGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card overflow-hidden rounded-xl p-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function TrackListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-3 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card flex items-center gap-4 p-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SessionGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 lg:grid-cols-3 xl:grid-cols-4 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card overflow-hidden rounded-xl">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReleaseListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card flex overflow-hidden rounded-xl">
          <Skeleton className="h-28 w-28 shrink-0 rounded-none sm:h-32 sm:w-32" />
          <div className="flex flex-1 flex-col justify-center gap-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div>
      <section className="relative min-h-[420px] border-b border-white/5 lg:min-h-[520px]">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <Skeleton className="mb-4 h-7 w-48 rounded-full" />
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="mt-4 h-12 w-full max-w-xl" />
          <Skeleton className="mt-8 h-11 w-full max-w-lg rounded-lg" />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 w-full rounded-lg sm:w-36" />
            <Skeleton className="h-12 w-full rounded-lg sm:w-32" />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
