import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { ArtistCard } from "@/components/cards/artist-card";
import { buildMetadata } from "@/lib/seo/metadata";
import { musicEventJsonLd } from "@/lib/seo/json-ld";
import { getEventBySlug } from "@/services/events.service";
import { formatDate } from "@/lib/utils";

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
    <article className="px-4 py-8 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary">
            {event.image_url && (
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold lg:text-4xl">{event.title}</h1>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(event.event_date)}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.venue} · {event.city}
              </p>
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>

        {event.artists && event.artists.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">DJs participantes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} variant="row" />
              ))}
            </div>
          </section>
        )}

        <Link
          href="/eventos"
          className="mt-8 inline-block text-sm text-makina-pink hover:underline"
        >
          ← Volver a eventos
        </Link>
      </div>
    </article>
  );
}
