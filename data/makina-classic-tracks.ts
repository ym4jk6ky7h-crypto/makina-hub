/**
 * Temas emblemáticos de mákina catalana por artista (slug).
 * npm run db:discover-tracks
 */
export type ClassicTrackSeed = {
  title: string;
  slug: string;
  year?: number;
  bpm?: number;
  genre?: "makina" | "remember" | "hardcore" | "hardstyle";
  description?: string;
  labelSlug?: string;
};

export const MAKINA_CLASSIC_TRACKS: Record<string, ClassicTrackSeed[]> = {
  pastis: [
    { title: "Pildo", slug: "pildo", year: 1996, bpm: 150, genre: "makina", description: "Top 2 España.", labelSlug: "xque-records" },
    { title: "Game Over II", slug: "game-over-ii", year: 2000, bpm: 155, genre: "makina", labelSlug: "djs-at-work" },
    { title: "Amazon-E", slug: "amazon-e", year: 1998, bpm: 148, genre: "makina", labelSlug: "xque-records" },
  ],
  buenri: [
    { title: "Vol. 1 - Attack (The New Generation)", slug: "vol-1-attack", year: 1997, bpm: 152, genre: "makina" },
    { title: "Millenium", slug: "millenium", year: 1998, bpm: 150, genre: "makina", labelSlug: "xque-records" },
    { title: "Pildo", slug: "pildo-buenri", year: 1996, bpm: 150, genre: "makina", labelSlug: "xque-records" },
  ],
  skudero: [
    { title: "Flying Free", slug: "flying-free", year: 1999, bpm: 150, genre: "makina", description: "Himno mákina catalán.", labelSlug: "pont-aeri-records" },
    { title: "Extasia", slug: "extasia", year: 1996, bpm: 155, genre: "makina", labelSlug: "max-music" },
    { title: "Elements", slug: "elements", year: 1999, bpm: 158, genre: "makina", description: "#1 listas España.", labelSlug: "bit-music" },
    { title: "Pont Aeri Vol. 2", slug: "pont-aeri-vol-2", year: 1996, bpm: 152, genre: "makina", labelSlug: "pont-aeri-records" },
    { title: "Fluor", slug: "fluor", year: 1997, bpm: 156, genre: "makina", labelSlug: "bit-music" },
  ],
  "marc-escudero": [
    { title: "Flying Free", slug: "flying-free-marc", year: 1999, bpm: 150, genre: "makina", labelSlug: "pont-aeri-records" },
    { title: "Elements", slug: "elements-marc", year: 1999, bpm: 158, genre: "makina", labelSlug: "bit-music" },
  ],
  "xavi-metralla": [
    { title: "Pont Aeri Vol. 3", slug: "pont-aeri-vol-3", year: 1997, bpm: 154, genre: "makina", labelSlug: "pont-aeri-records" },
    { title: "Hard Català", slug: "hard-catala", year: 1999, bpm: 160, genre: "makina" },
  ],
  "ricardo-f": [
    { title: "Chasis Resident", slug: "chasis-resident", year: 1996, bpm: 150, genre: "makina", labelSlug: "chasis-records" },
    { title: "Chasis Session", slug: "chasis-session-ricardo", year: 1998, bpm: 152, genre: "makina", labelSlug: "chasis-records" },
  ],
  "gerard-requena": [
    { title: "Cyberspace", slug: "cyberspace", year: 1997, bpm: 142, genre: "makina", labelSlug: "bit-music" },
    { title: "Melodic Makina", slug: "melodic-makina", year: 1995, bpm: 142, genre: "makina", labelSlug: "bit-music" },
  ],
  "frank-trax": [
    { title: "Frank Trax Anthem", slug: "frank-trax-anthem", year: 1997, bpm: 154, genre: "makina", labelSlug: "bit-music" },
    { title: "The Noise Sindicate", slug: "noise-sindicate", year: 1998, bpm: 156, genre: "makina", labelSlug: "xque-records" },
  ],
  ruboy: [
    { title: "Game Over II (remix)", slug: "game-over-ruboy", year: 2000, bpm: 155, genre: "makina", labelSlug: "djs-at-work" },
  ],
  chumi: [
    { title: "Limite Vol. 12", slug: "limite-vol-12", year: 1998, bpm: 150, genre: "makina", labelSlug: "bit-music" },
  ],
  konik: [
    { title: "Konik Power", slug: "konik-power", year: 1997, bpm: 154, genre: "makina", labelSlug: "bit-music" },
  ],
  "t-ty": [
    { title: "T-TY Bounce", slug: "t-ty-bounce", year: 1998, bpm: 150, genre: "makina", labelSlug: "max-music" },
  ],
  kullere: [
    { title: "Kulleré Track", slug: "kullere-track", year: 1998, bpm: 150, genre: "makina", labelSlug: "max-music" },
  ],
};

export const MAKINA_TRACK_COUNT = Object.values(MAKINA_CLASSIC_TRACKS).reduce(
  (n, t) => n + t.length,
  0
);
