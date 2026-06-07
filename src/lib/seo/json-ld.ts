import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Plataforma de referencia de música mákina, remember y hardcore español.",
    sameAs: [],
  };
}

export function musicEventJsonLd(event: {
  title: string;
  description: string;
  event_date: string;
  city: string;
  venue: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    description: event.description,
    startDate: event.event_date,
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: "ES",
      },
    },
    url: `${SITE_URL}/eventos/${event.slug}`,
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function musicRecordingJsonLd(track: {
  title: string;
  slug: string;
  year: number | null;
  artistName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: track.title,
    url: `${SITE_URL}/musica/${track.slug}`,
    datePublished: track.year?.toString(),
    byArtist: {
      "@type": "MusicGroup",
      name: track.artistName,
    },
  };
}

export function personJsonLd(artist: {
  name: string;
  biography: string;
  slug: string;
  image_url: string | null;
}) {
  const bio = artist.biography?.trim();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    description: bio ? bio.slice(0, 500) : undefined,
    url: `${SITE_URL}/artistas/${artist.slug}`,
    image: artist.image_url ?? undefined,
  };
}
