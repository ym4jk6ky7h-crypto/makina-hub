/**
 * Seed dataset for Makina Hub (mákina / remember scene).
 * Used by scripts/seed.ts and scripts/generate-seed-sql.ts
 */

export type SeedGenre =
  | "makina"
  | "remember"
  | "hardcore"
  | "makina-revival"
  | "bouncy"
  | "hard-dance";

export type SeedRarity = "common" | "uncommon" | "rare" | "legendary";

/** Avatar determinista por nombre (siempre carga) */
export const avatarImg = (name: string) => {
  const encoded = encodeURIComponent(name.replace(/&/g, "and"));
  return `https://ui-avatars.com/api/?name=${encoded}&size=512&background=1a1a2e&color=ff2d6a&bold=true`;
};

const IMG = (name: string) => avatarImg(name);

export const SEED_LABELS = [
  { id: "a0000001-0001-4000-8000-000000000001", slug: "bit-music", name: "Bit Music", description: "Sello valenciano pilar del remember español de los 90.", logo_url: null, founded_year: 1993 },
  { id: "a0000001-0001-4000-8000-000000000002", slug: "tempo-music", name: "Tempo Music", description: "Catálogo enorme de hard dance y mákina valenciana.", logo_url: null, founded_year: 1994 },
  { id: "a0000001-0001-4000-8000-000000000003", slug: "vale-music", name: "Vale Music", description: "Producciones vocales y comerciales de Castellón y Valencia.", logo_url: null, founded_year: 1995 },
  { id: "a0000001-0001-4000-8000-000000000004", slug: "blanco-y-negro", name: "Blanco y Negro", description: "Gigante del dance español con ramas mákina y remember.", logo_url: null, founded_year: 1989 },
  { id: "a0000001-0001-4000-8000-000000000005", slug: "ids-records", name: "IDS Records", description: "Hardcore y makina de los 90 con distribución europea.", logo_url: null, founded_year: 1994 },
  { id: "a0000001-0001-4000-8000-000000000006", slug: "norma-records", name: "Norma Records", description: "Sello asociado a la escena remember de Barcelona.", logo_url: null, founded_year: 1996 },
  { id: "a0000001-0001-4000-8000-000000000007", slug: "gira-records", name: "Gira Records", description: "Mákina comercial y bouncy del Levante.", logo_url: null, founded_year: 1997 },
  { id: "a0000001-0001-4000-8000-000000000008", slug: "desire-records", name: "Desire Records", description: "Remember melódico y vocales euro.", logo_url: null, founded_year: 1995 },
  { id: "a0000001-0001-4000-8000-000000000009", slug: "zoom-records", name: "Zoom Records", description: "Hard dance y makina para macrodiscotecas.", logo_url: null, founded_year: 1996 },
  { id: "a0000001-0001-4000-8000-00000000000a", slug: "fresh-records", name: "Fresh Records", description: "Revival y nuevas producciones mákina 2010+.", logo_url: null, founded_year: 2012 },
] as const;

export const SEED_ARTISTS = [
  { id: "b0000001-0001-4000-8000-000000000001", slug: "pastis-buenri", name: "Pastis & Buenri", real_name: "Pastis / Buenri", biography: "Dúo icónico del remember valenciano. Himnos que siguen llenando pistas.", country: "España", city: "Valencia", image_url: IMG("Pastis & Buenri"), instagram_url: "https://instagram.com", youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000002", slug: "chimo-bayo", name: "Chimo Bayo", real_name: "Joaquín Ramírez", biography: "Pionero de la mákina española y productor de clásicos de los 90.", country: "España", city: "Valencia", image_url: IMG("Chimo Bayo"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000003", slug: "x-treme-que", name: "X-Treme Que", real_name: null, biography: "Proyecto hardcore/mákina agresivo de la escena valenciana.", country: "España", city: "Valencia", image_url: IMG("X-Treme Que"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000004", slug: "nit-69", name: "Nit 69", real_name: null, biography: "DJ remember catalán con sesiones legendarias en la costa.", country: "España", city: "Barcelona", image_url: IMG("Nit 69"), instagram_url: "https://instagram.com", youtube_url: null, spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000005", slug: "pandora", name: "Pandora", real_name: null, biography: "Voz femenina del remember español en los 90.", country: "España", city: "Valencia", image_url: IMG("Pandora"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000006", slug: "pamsy", name: "Pamsy", real_name: null, biography: "Productor hardcore y mákina con sonido europeo.", country: "España", city: "Madrid", image_url: IMG("Pamsy"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000007", slug: "makina-revival-collective", name: "Makina Revival Collective", real_name: null, biography: "Colectivo de la nueva ola mákina y remember revival.", country: "España", city: "Barcelona", image_url: IMG("Makina Revival"), instagram_url: "https://instagram.com", youtube_url: "https://youtube.com", spotify_url: "https://open.spotify.com" },
  { id: "b0000001-0001-4000-8000-000000000008", slug: "dj-alex", name: "DJ Alex", real_name: "Alejandro G.", biography: "Referente remember en macrodiscotecas del Mediterráneo.", country: "España", city: "Alicante", image_url: IMG("DJ Alex"), instagram_url: "https://instagram.com", youtube_url: null, spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000009", slug: "saturator", name: "Saturator", real_name: null, biography: "Hard dance y makina con líneas 150+ BPM.", country: "España", city: "Valencia", image_url: IMG("Saturator"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-00000000000a", slug: "tony-beltran", name: "Tony Beltrán", real_name: "Tony Beltrán", biography: "Productor y DJ de mákina comercial valenciana.", country: "España", city: "Castellón", image_url: IMG("Tony Beltran"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-00000000000b", slug: "kris-makina", name: "Kris Makina", real_name: null, biography: "Sonido bouncy y remember para festivales outdoor.", country: "España", city: "Murcia", image_url: IMG("Kris Makina"), instagram_url: "https://instagram.com", youtube_url: null, spotify_url: null },
  { id: "b0000001-0001-4000-8000-00000000000c", slug: "energy-dj", name: "Energy DJ", real_name: null, biography: "Sets de hardcore y makina en salas industriales.", country: "España", city: "Madrid", image_url: IMG("Energy DJ"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-00000000000d", slug: "la-rioja-sound", name: "La Rioja Sound", real_name: null, biography: "Producciones remember con influencias eurodance.", country: "España", city: "Zaragoza", image_url: IMG("La Rioja Sound"), instagram_url: null, youtube_url: null, spotify_url: null },
  { id: "b0000001-0001-4000-8000-00000000000e", slug: "valencia-boys", name: "Valencia Boys", real_name: null, biography: "Dúo mákina con temas para verbenas y macrofiestas.", country: "España", city: "Valencia", image_url: IMG("Valencia Boys"), instagram_url: "https://instagram.com", youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-00000000000f", slug: "remember-girls", name: "Remember Girls", real_name: null, biography: "Vocales remember y edits de clásicos de los 90.", country: "España", city: "Valencia", image_url: IMG("Remember Girls"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000010", slug: "hard-paella", name: "Hard Paella", real_name: null, biography: "Proyecto parodia/homage a la makina valenciana.", country: "España", city: "Valencia", image_url: IMG("Hard Paella"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000011", slug: "castellon-crew", name: "Castellón Crew", real_name: null, biography: "Colectivo de DJs remember de la provincia.", country: "España", city: "Castellón", image_url: IMG("Castellon Crew"), instagram_url: "https://instagram.com", youtube_url: null, spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000012", slug: "balearic-makina", name: "Balearic Makina", real_name: null, biography: "Fusión remember y makina para clubs de Ibiza y Mallorca.", country: "España", city: "Palma", image_url: IMG("Balearic Makina"), instagram_url: null, youtube_url: "https://youtube.com", spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000013", slug: "torrevieja-sound", name: "Torrevieja Sound", real_name: null, biography: "Mákina costera y temas de verano para la Costa Blanca.", country: "España", city: "Alicante", image_url: IMG("Torrevieja Sound"), instagram_url: null, youtube_url: null, spotify_url: null },
  { id: "b0000001-0001-4000-8000-000000000014", slug: "fabrik-resident", name: "Fabrik Resident", real_name: null, biography: "Residente hard dance en la escena madrileña.", country: "España", city: "Madrid", image_url: IMG("Fabrik Resident"), instagram_url: "https://instagram.com", youtube_url: "https://youtube.com", spotify_url: "https://open.spotify.com" },
] as const;

const TRACK_TEMPLATES = [
  "Flying Free", "Makina Power", "Remember Anthem", "Valencia Sunrise", "Euro Dream",
  "Hard Paella", "Paella Power", "X-Treme Theme", "Nit Anthem", "Bouncy Night",
  "Revival Nights", "Makina 2001", "Discoteca", "Macro Mix", "Verano Remember",
  "Castellón Nights", "Barcelona Bounce", "170 BPM", "Vocal Explosion", "Bit Music Classic",
];

const GENRES: SeedGenre[] = ["makina", "remember", "hardcore", "makina-revival", "bouncy", "hard-dance"];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function buildSeedTracks() {
  const tracks = [];
  for (let i = 0; i < 100; i++) {
    const artist = SEED_ARTISTS[i % SEED_ARTISTS.length];
    const label = SEED_LABELS[i % SEED_LABELS.length];
    const base = TRACK_TEMPLATES[i % TRACK_TEMPLATES.length];
    const title = i < TRACK_TEMPLATES.length ? base : `${base} ${Math.floor(i / TRACK_TEMPLATES.length) + 1}`;
    const slug = slugify(`${artist.slug}-${title}-${i}`);
    const year = 1994 + (i % 12);
    const bpm = 135 + (i % 30);
    const genre = GENRES[i % GENRES.length];
    tracks.push({
      id: `c0000001-${String(i + 1).padStart(4, "0")}-4000-8000-${String(i + 1).padStart(12, "0")}`,
      slug,
      title,
      artist_id: artist.id,
      year,
      bpm,
      label_id: label.id,
      genre,
      youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: `${title} — tema ${genre} de ${artist.name} (${year}).`,
    });
  }
  return tracks;
}

export function buildSeedEvents() {
  const cities = ["Valencia", "Barcelona", "Castellón", "Madrid", "Alicante", "Murcia", "Palma", "Tarragona", "Zaragoza", "Gandía"];
  const venues = ["Razzmatazz", "Fabrik", "Marina Casanova", "Ciudad de las Artes", "Playa San Juan", "Sala Moon", "Industrial Club", "Arena", "Macro Beach", "Club Central"];
  return Array.from({ length: 20 }, (_, i) => {
    const city = cities[i % cities.length];
    const year = 2025 + (i % 2);
    const title = `Remember & Makina ${city} ${year}`;
    return {
      id: `d0000001-${String(i + 1).padStart(4, "0")}-4000-8000-${String(i + 1).padStart(12, "0")}`,
      slug: slugify(`${title}-edicion-${i + 1}`),
      title,
      description: `Noche de remember y mákina en ${city}. Cartel con DJs nacionales y zona revival.`,
      event_date: new Date(2025 + (i % 2), (i % 12), 10 + (i % 18), 22, 0).toISOString(),
      city,
      venue: venues[i % venues.length],
      image_url: IMG(`Event ${city}`),
    };
  });
}

export function buildSeedSessions() {
  return Array.from({ length: 20 }, (_, i) => {
    const artist = SEED_ARTISTS[i % SEED_ARTISTS.length];
    const year = 1996 + (i % 8);
    const title = `${artist.name} — Live Session ${year}`;
    return {
      id: `e0000001-${String(i + 1).padStart(4, "0")}-4000-8000-${String(i + 1).padStart(12, "0")}`,
      slug: slugify(`${title}-set-${i + 1}`),
      title,
      artist_id: artist.id,
      duration: 45 + (i % 40),
      youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      tracklist: [
        `${TRACK_TEMPLATES[i % TRACK_TEMPLATES.length]} — ${artist.name}`,
        `${TRACK_TEMPLATES[(i + 1) % TRACK_TEMPLATES.length]} — Various`,
        `${TRACK_TEMPLATES[(i + 2) % TRACK_TEMPLATES.length]} — Various`,
      ],
      created_at: new Date(1996 + (i % 10), i % 12, 1).toISOString(),
    };
  });
}

export function buildSeedVinyls() {
  const rarities: SeedRarity[] = ["common", "uncommon", "rare", "legendary"];
  return Array.from({ length: 20 }, (_, i) => {
    const artist = SEED_ARTISTS[i % SEED_ARTISTS.length];
    const label = SEED_LABELS[i % SEED_LABELS.length];
    const title = TRACK_TEMPLATES[i % TRACK_TEMPLATES.length];
    return {
      id: `f0000001-${String(i + 1).padStart(4, "0")}-4000-8000-${String(i + 1).padStart(12, "0")}`,
      slug: slugify(`vinyl-${artist.slug}-${title}`),
      title,
      artist_id: artist.id,
      label_id: label.id,
      year: 1995 + (i % 10),
      catalog_number: `${label.slug.slice(0, 3).toUpperCase()} ${100 + i}`,
      cover_url: IMG(title),
      estimated_value: 15 + i * 12,
      rarity: rarities[i % rarities.length],
    };
  });
}

export function buildEventArtists() {
  const events = buildSeedEvents();
  const links: { event_id: string; artist_id: string }[] = [];
  events.forEach((ev, i) => {
    links.push({ event_id: ev.id, artist_id: SEED_ARTISTS[i % SEED_ARTISTS.length].id });
    links.push({ event_id: ev.id, artist_id: SEED_ARTISTS[(i + 1) % SEED_ARTISTS.length].id });
    if (i % 2 === 0) {
      links.push({ event_id: ev.id, artist_id: SEED_ARTISTS[(i + 3) % SEED_ARTISTS.length].id });
    }
  });
  return links;
}
