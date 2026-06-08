import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistCard } from "@/components/cards/artist-card";
import { EventDetailHero } from "@/components/events/event-detail-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { musicEventJsonLd } from "@/lib/seo/json-ld";
import { getEventBySlug } from "@/services/events.service";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return buildMetadata({
    title: event.title,
    description: event.description.slice(0, 160),
    path: `/eventos/${slug}`,
    image: event.image_url ?? undefined,
  });
}

export default async function EventoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const jsonLd = musicEventJsonLd(event);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EventDetailHero event={event} />

      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold text-makina-cyan">Sobre la fiesta</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{event.description}</p>
        </section>

        {event.artists && event.artists.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 font-display text-xl font-bold">DJs participantes</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {event.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} variant="row" />
              ))}
            </div>
          </section>
        )}

        <Link
          href="/eventos"
          className="mt-10 inline-block text-sm font-medium text-makina-cyan hover:underline"
        >
          ← Volver a eventos
        </Link>
      </div>
    </article>
  );
}
