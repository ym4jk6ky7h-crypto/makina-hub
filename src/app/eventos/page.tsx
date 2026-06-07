import { Suspense } from "react";
import { Calendar } from "lucide-react";
import { EventsAgenda } from "@/components/events/events-agenda";
import { EventsWeekendStrip } from "@/components/events/events-weekend-strip";
import { EmptyState } from "@/components/ui/empty-state";
import { EventFilters } from "@/components/events/event-filters";
import { PageHero } from "@/components/layout/page-hero";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { getEventTimingBadge } from "@/lib/event-timing";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { listEvents } from "@/services/events.service";

export const metadata = buildMetadata({
  title: "Eventos",
  description:
    "Agenda de fiestas mákina y remember en Catalunya: macrofestivales, Makina Legends, salas medianas y locales pequeños.",
  path: "/eventos",
});

type PageProps = {
  searchParams: Promise<{ ciudad?: string; fecha?: string; vista?: string }>;
};

export default async function EventosPage({ searchParams }: PageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales en CLAVES-SUPABASE.env. Reinicia npm run dev." />
    );
  }

  try {
    const params = await searchParams;
    const showAll = params.fecha === "all";
    const city =
      params.ciudad && params.ciudad !== "all" ? params.ciudad : undefined;
    const view = params.vista === "compacta" ? "compacta" : "cartel";

    const events = await listEvents({
      city,
      includePast: showAll,
    });

    const weekendEvents = showAll
      ? []
      : events.filter((e) => getEventTimingBadge(e.event_date) !== null);

    return (
      <>
        <PageHero
          title="Eventos mákina"
          subtitle="Agenda en Catalunya: grandes festivales, Makina Legends, Xque!, Love Makina, Chasis y fiestas en locales pequeños."
          image={SITE_IMAGES.heroEvents}
          badge={`${events.length} próximos`}
        />

        <Suspense
          fallback={
            <div className="sticky top-16 z-40 h-24 border-b border-white/5 bg-background/80" />
          }
        >
          <EventFilters sticky />
        </Suspense>

        <div className="page-accent-events mx-auto max-w-7xl rounded-2xl border px-4 py-8 pb-6 lg:px-8 lg:py-10">
          {!showAll && weekendEvents.length > 0 && (
            <EventsWeekendStrip events={weekendEvents} />
          )}
          <EventsAgenda events={events} view={view} />

          {events.length === 0 && (
            <EmptyState
              icon={Calendar}
              title="No hay eventos con estos filtros"
              description="Prueba otra ciudad, muestra toda la agenda o quita los filtros activos."
              actions={[
                { label: "Quitar filtros", href: "/eventos" },
                { label: "Toda la agenda", href: "/eventos?fecha=all", variant: "outline" },
              ]}
            />
          )}
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
