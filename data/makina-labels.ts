/**
 * Sellos discográficos clave de la mákina catalana.
 * npm run db:discover-labels
 */
export type MakinaLabelSeed = {
  name: string;
  slug: string;
  city: string;
  founded?: number;
  description: string;
  website?: string;
};

export const MAKINA_LABELS: MakinaLabelSeed[] = [
  {
    name: "Max Music",
    slug: "max-music",
    city: "Barcelona",
    founded: 1984,
    description:
      "Discográfica barcelonesa fundada por Miguel Degá y Ricardo Campoy. Publicó ~80% de la electrónica catalana en los 90: Máquina Total, Bombazo Mix, Max Mix e himnos como Flying Free.",
  },
  {
    name: "Bit Music",
    slug: "bit-music",
    city: "Barcelona",
    founded: 1994,
    description:
      "Sublabel electrónico de Divucsa (Barcelona). Catálogo mákina con Gerard Requena, Julio Posadas, Sistema 3, Jordi Robles, Pastis & Buenri y recopilatorios de Central y Scorpia.",
  },
  {
    name: "Xque Records",
    slug: "xque-records",
    city: "Granollers",
    founded: 1996,
    description: "Sello de la discoteca Xque! (Granollers). Pastis & Buenri, CJ Rolo, DJ Ruboy y compilaciones Xque Compilation.",
  },
  {
    name: "Chasis Records",
    slug: "chasis-records",
    city: "Barcelona",
    founded: 1995,
    description: "Sublabel de Bit Music vinculado a la discoteca Chasis. Ricardo F., Frank TRAX y hard melódico sólo-mákina.",
  },
  {
    name: "Enjoy It Studios",
    slug: "enjoy-it-studios",
    city: "Barcelona",
    founded: 1987,
    description: "Estudio/sello de Julio Posadas. Producciones pioneras que conectaron Max Music con la explosión mákina catalana.",
  },
  {
    name: "Previous Records",
    slug: "previous-records",
    city: "Barcelona",
    founded: 1999,
    description: "Archivo y reedición de clásicos mákina/remember 90s. David Con G preserva el catálogo olvidado del revival.",
  },
  {
    name: "Uptempo",
    slug: "uptempo",
    city: "Barcelona",
    founded: 1998,
    description: "Sello hard/mákina. Lanzamientos de Pastis & Buenri, Juan Magán (Firestorm) y productores de la segunda ola.",
  },
  {
    name: "DJ's At Work",
    slug: "djs-at-work",
    city: "Barcelona",
    founded: 1997,
    description: "Sello asociado a Pastis & Buenri y colaboradores (Ruboy, Uraken). Hard trance-mákina comercial.",
  },
  {
    name: "Pont Aeri",
    slug: "pont-aeri-records",
    city: "Barcelona",
    founded: 1996,
    description:
      "Recopilatorios de la ruta/discoteca Pont Aeri. Vol. 4 incluye Flying Free, el mayor éxito comercial de la mákina catalana.",
  },
  {
    name: "SFERA Records",
    slug: "sfera-records",
    city: "Barcelona",
    founded: 2005,
    description: "Sello actual de Gerard Requena. Progressive, trance y legado del mayor productor mákina de Cataluña.",
  },
];
