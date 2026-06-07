export type MusicQueueItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  audioUrl: string;
  artworkUrl?: string | null;
  href: string;
  downloadUrl?: string | null;
  isPreview?: boolean;
};
