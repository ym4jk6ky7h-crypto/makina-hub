export type Genre =
  | "makina"
  | "remember"
  | "hardcore"
  | "makina-revival"
  | "bouncy"
  | "hard-dance";

export type VinylRarity = "common" | "uncommon" | "rare" | "legendary";

export interface Artist {
  id: string;
  slug: string;
  name: string;
  real_name: string | null;
  biography: string;
  country: string | null;
  city: string | null;
  image_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  spotify_url: string | null;
  created_at: string;
}

export interface Label {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url: string | null;
  founded_year: number | null;
  created_at?: string;
}

export type TrackSourceType =
  | "hosted"
  | "itunes_preview"
  | "bandcamp"
  | "external";

export interface Track {
  id: string;
  slug: string;
  title: string;
  artist_id: string;
  year: number | null;
  bpm: number | null;
  label_id: string | null;
  genre: Genre;
  youtube_url: string | null;
  audio_url: string | null;
  preview_url: string | null;
  download_url: string | null;
  source_type: TrackSourceType | null;
  description: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string;
  city: string;
  venue: string;
  image_url: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  slug: string;
  title: string;
  artist_id: string;
  duration: number | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  youtube_published_at: string | null;
  tracklist: string[];
  created_at: string;
}

export interface Vinyl {
  id: string;
  slug: string;
  title: string;
  artist_id: string;
  label_id: string | null;
  year: number | null;
  catalog_number: string;
  cover_url: string | null;
  estimated_value: number | null;
  rarity: VinylRarity;
  created_at?: string;
}

export interface EventArtist {
  event_id: string;
  artist_id: string;
}

export type ArtistWithRelations = Artist & {
  tracks?: Track[];
  events?: Event[];
  sessions?: Session[];
};

export type TrackWithRelations = Track & {
  artist?: Artist | null;
  label?: Label | null;
  similar?: Track[];
};

export type EventWithRelations = Event & {
  artists?: Artist[];
};

export type SessionWithRelations = Session & {
  artist?: Artist | null;
};

export type LabelWithRelations = Label & {
  tracks?: Track[];
  artists?: Artist[];
  vinyls?: Vinyl[];
};

export type VinylWithRelations = Vinyl & {
  artist?: Artist | null;
  label?: Label | null;
};

export interface NewRelease {
  id: string;
  slug: string;
  title: string;
  artist_id: string;
  label_id: string | null;
  release_date: string;
  purchase_url: string;
  store_name: string;
  cover_url: string | null;
  description: string | null;
  genre: Genre;
  youtube_url: string | null;
  featured: boolean;
  created_at: string;
}

export type NewReleaseWithRelations = NewRelease & {
  artist?: Artist | null;
  label?: Label | null;
};

export interface GlobalSearchResults {
  artists: Artist[];
  tracks: TrackWithRelations[];
  events: Event[];
  sessions: SessionWithRelations[];
  vinyls: VinylWithRelations[];
  labels: Label[];
  newReleases?: NewReleaseWithRelations[];
}
