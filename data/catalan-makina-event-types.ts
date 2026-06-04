export type CatalanMakinaEventSeed = {
  title: string;
  slug: string;
  description: string;
  /** ISO date YYYY-MM-DD */
  eventDate: string;
  city: string;
  venue: string;
  imageUrl?: string;
  eventPageUrl?: string;
  /** slugs de artists en makina-artists.ts */
  artistSlugs: string[];
};
