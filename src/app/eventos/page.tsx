import { Suspense } from "react";
import { EventCard } from "@/components/cards/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { PageHero } from "@/components/layout/page-hero";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils";
import { listEvents } from "@/services/events.service";

export const metadata = buildMetadata({
  title: "Eventos",
  description:
    "Agenda de fiestas mákina y remember en Catalunya: macrofestivales, Makina Legends, salas medianas y locales pequeños.",
  path: "/eventos",
});

type PageProps = {
  searchParams: Promise<{ ciudad?: string; fecha?: string }>;
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

    const events = await listEvents({
      city,
      includePast: showAll,
    });

    return (
      <>
        <PageHero
          title="Eventos mákina"
          subtitle="Agenda en Catalunya: grandes festivales, Makina Legends, Xque!, Love Makina, Chasis y fiestas en locales pequeños."
          image={SITE_IMAGES.heroEvents}
          badge={`${events.length} próximos`}
        >
          <Suspense fallback={<div className="h-10" />}>
            <EventFilters />
          </Suspense>
        </PageHero>

        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="glass-card-hover grid gap-4 rounded-2xl p-4 sm:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]"
              >
                <div className="hidden text-sm font-semibold text-makina-cyan sm:block sm:pt-2">
                  {formatDate(event.event_date)}
                </div>
                <EventCard event={event} variant="row" />
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="mt-12 space-y-4 text-center text-muted-foreground">
              <p>No hay eventos con estos filtros.</p>
              <p className="text-sm">
                Prueba{" "}
                <a href="/eventos" className="text-makina-pink hover:underline">
                  quitar filtros
                </a>
                ,{" "}
                <a
                  href="/eventos?fecha=all"
                  className="text-makina-pink hover:underline"
                >
                  ver toda la agenda
                </a>{" "}
                o sincroniza datos:{" "}
                <code className="text-xs">npm run db:discover-events</code>
              </p>
            </div>
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
