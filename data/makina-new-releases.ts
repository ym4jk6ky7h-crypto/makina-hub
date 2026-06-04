/**
 * Nuevas producciones mákina — enlace a tienda de compra (Beatport, Juno, Bandcamp…).
 * npm run db:discover-releases
 */
export type NewReleaseSeed = {
  title: string;
  slug: string;
  artistSlug: string;
  labelSlug?: string;
  /** YYYY-MM-DD */
  releaseDate: string;
  purchaseUrl: string;
  storeName: string;
  description?: string;
  genre?: "makina" | "remember" | "hardcore" | "hardstyle";
  youtubeUrl?: string;
  coverUrl?: string;
};

export const MAKINA_NEW_RELEASES: NewReleaseSeed[] = [
  {
    title: "Universo Makina",
    slug: "pastis-buenri-universo-makina",
    artistSlug: "pastis",
    labelSlug: "xque-records",
    releaseDate: "2024-11-15",
    purchaseUrl: "https://www.beatport.com/search?q=pastis+buenri+universo+makina",
    storeName: "Beatport",
    description: "Single del dúo catalán en clave remember-mákina.",
    genre: "makina",
  },
  {
    title: "Flying Free (Remaster 2025)",
    slug: "skudero-flying-free-remaster",
    artistSlug: "skudero",
    labelSlug: "pont-aeri-records",
    releaseDate: "2025-03-01",
    purchaseUrl: "https://www.junodownload.com/search/?q[]=skudero+flying+free",
    storeName: "Juno Download",
    description: "Himno mákina catalán — edición digital.",
    genre: "makina",
    youtubeUrl: "https://www.youtube.com/results?search_query=skudero+flying+free",
  },
  {
    title: "Remember Session Vol. 1",
    slug: "xavi-metralla-remember-session-vol-1",
    artistSlug: "xavi-metralla",
    releaseDate: "2025-01-20",
    purchaseUrl: "https://www.beatport.com/search?q=xavi+metralla+makina",
    storeName: "Beatport",
    genre: "remember",
  },
  {
    title: "Konik Power EP",
    slug: "konik-power-ep",
    artistSlug: "konik",
    labelSlug: "bit-music",
    releaseDate: "2025-05-10",
    purchaseUrl: "https://www.beatport.com/search?q=konik+power+makina",
    storeName: "Beatport",
    genre: "makina",
  },
  {
    title: "Chumi DJ — Limite Edición",
    slug: "chumi-limite-edicion",
    artistSlug: "chumi",
    labelSlug: "bit-music",
    releaseDate: "2025-02-14",
    purchaseUrl: "https://www.junodownload.com/search/?q[]=chumi+dj+makina",
    storeName: "Juno Download",
    genre: "makina",
  },
  {
    title: "Gerard Requena — Cyberspace 2025",
    slug: "gerard-requena-cyberspace-2025",
    artistSlug: "gerard-requena",
    labelSlug: "bit-music",
    releaseDate: "2025-04-08",
    purchaseUrl: "https://www.beatport.com/search?q=gerard+requena+cyberspace",
    storeName: "Beatport",
    genre: "makina",
  },
  {
    title: "Javi Level — Terminal Session",
    slug: "javi-level-terminal-session",
    artistSlug: "javi-level",
    releaseDate: "2025-06-01",
    purchaseUrl: "https://www.beatport.com/search?q=javi+level+makina",
    storeName: "Beatport",
    genre: "makina",
  },
  {
    title: "Dani BPM — Bit Session",
    slug: "dany-bpm-bit-session",
    artistSlug: "dany-bpm",
    labelSlug: "bit-music",
    releaseDate: "2025-07-19",
    purchaseUrl: "https://www.beatport.com/search?q=dani+bpm+makina",
    storeName: "Beatport",
    genre: "makina",
  },
  {
    title: "Ruboy — Game Over Remix",
    slug: "ruboy-game-over-remix",
    artistSlug: "ruboy",
    labelSlug: "djs-at-work",
    releaseDate: "2025-03-22",
    purchaseUrl: "https://www.junodownload.com/search/?q[]=ruboy+game+over",
    storeName: "Juno Download",
    genre: "makina",
  },
  {
    title: "Nando Dixkontrol — Legends EP",
    slug: "nando-dixkontrol-legends-ep",
    artistSlug: "nando-dixkontrol",
    releaseDate: "2025-08-30",
    purchaseUrl: "https://www.beatport.com/search?q=nando+dixkontrol+makina",
    storeName: "Beatport",
    genre: "makina",
  },
  {
    title: "Pastis — Millenium (Digital)",
    slug: "pastis-millenium-digital",
    artistSlug: "pastis",
    labelSlug: "xque-records",
    releaseDate: "2025-09-12",
    purchaseUrl: "https://www.beatport.com/search?q=pastis+millenium+makina",
    storeName: "Beatport",
    genre: "makina",
  },
  {
    title: "Buenri — Amazon-E Rework",
    slug: "buenri-amazon-e-rework",
    artistSlug: "buenri",
    labelSlug: "xque-records",
    releaseDate: "2025-10-05",
    purchaseUrl: "https://www.junodownload.com/search/?q[]=buenri+amazon",
    storeName: "Juno Download",
    genre: "makina",
  },
];
