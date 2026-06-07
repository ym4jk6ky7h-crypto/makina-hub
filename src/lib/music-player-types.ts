export type MusicQueueItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  href: string;
  artworkUrl?: string | null;
  downloadUrl?: string | null;
  /** MP3 alojado (tema completo) */
  audioUrl?: string | null;
  /** YouTube verificado mákina (tema completo) */
  videoId?: string | null;
  watchUrl?: string | null;
};
