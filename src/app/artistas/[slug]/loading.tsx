import { Skeleton } from "@/components/ui/skeleton";

export default function ArtistaDetailLoading() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 md:flex-row md:items-end md:py-14 lg:px-8">
          <Skeleton className="h-56 w-56 shrink-0 rounded-2xl md:h-64 md:w-64" />
          <div className="flex-1 space-y-4 pb-2 text-center md:text-left">
            <Skeleton className="mx-auto h-4 w-20 md:mx-0" />
            <Skeleton className="mx-auto h-12 w-64 max-w-full md:mx-0" />
            <Skeleton className="mx-auto h-4 w-40 md:mx-0" />
            <div className="flex justify-center gap-2 md:justify-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 lg:px-8">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
