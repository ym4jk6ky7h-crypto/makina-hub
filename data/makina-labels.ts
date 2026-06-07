/**
 * Sellos discogr?ficos clave de la m?kina catalana.
 * npm run db:discover-labels
 */
export type MakinaLabelSeed = {
  name: string;
  slug: string;
  city: string;
  founded?: number;
  description: string;
  /** P?rrafo ampliado para la ficha del sello */
  history: string;
  website?: string;
  artistSlugs?: string[];
  classics?: string[];
};

export const MAKINA_LABELS: MakinaLabelSeed[] = [
  {
    name: "Max Music",
    slug: "max-music",
    city: "Barcelona",
    founded: 1984,
    description:
      "Discogr?fica barcelonesa fundada por Miguel Deg? y Ricardo Campoy. Public? gran parte de la electr?nica catalana en los 90.",
    history:
      "Max Music fue el eje comercial de la m?kina en Catalunya: compilados como M?quina Total, Bombazo Mix y Max Mix llegaron a toda Espa?a. Flying Free de Skudero, publicado en el cat?logo Max/Pont Aeri, sigue siendo el mayor ?xito de ventas del g?nero. El sello conect? la pista de baile con el mainstream radiof?nico y abri? la puerta a sublabels como Bit Music.",
    artistSlugs: ["skudero", "pastis", "buenri", "dj-sisu", "frank-trax"],
    classics: ["Flying Free", "M?quina Total", "Max Mix"],
  },
  {
    name: "Bit Music",
    slug: "bit-music",
    city: "Barcelona",
    founded: 1994,
    description:
      "Sublabel electr?nico de Divucsa. Cat?logo m?kina con Gerard Requena, Chumi, Konik y recopilatorios de Chasis y Scorpia.",
    history:
      "Bit Music concentr? la segunda ola de la m?kina barcelonesa: sesiones en Chasis, Scorpia y MacroSound quedaron plasmadas en vinilos y CDs que hoy buscan los coleccionistas del revival. Gerard Requena (Cyberspace), Chumi (Limite), Konik Power y las series Remember Session son referencias directas del sello valenciano-barcelon?s.",
    artistSlugs: ["gerard-requena", "chumi", "konik", "javi-boss", "dany-bpm"],
    classics: ["Cyberspace", "Limite Vol. 12", "Konik Power"],
  },
  {
    name: "Xque Records",
    slug: "xque-records",
    city: "Granollers",
    founded: 1996,
    description: "Sello de la discoteca Xque! (Granollers). Pastis & Buenri, Ruboy y compilaciones Xque.",
    history:
      "Xque! en Granollers fue templo del remember catal?n. El sello Xque Records document? la transici?n del hardcore mel?dico a la m?kina comercial con Pastis & Buenri, CJ Rolo, Ruboy y las compilaciones que a?n suenan en fiestas revival. Pildo, Game Over y Amazon-E son himnos ligados a esta marca.",
    artistSlugs: ["pastis", "buenri", "ruboy", "pitu-cesk"],
    classics: ["Pildo", "Game Over II", "Amazon-E"],
  },
  {
    name: "Chasis Records",
    slug: "chasis-records",
    city: "Barcelona",
    founded: 1995,
    description: "Sublabel de Bit Music vinculado a la discoteca Chasis. Ricardo F., Frank Trax y hard mel?dico s?lo-m?kina.",
    history:
      "Chasis, en el coraz?n de la noche barcelonesa, ten?a sello propio para capturar el sonido de sus sesiones. Ricardo F., Frank Trax, Abel K Ka?a y la est?tica m?s dura de la m?kina ?sin tanto canto remember? vivieron aqu?. Chasis Records es sin?nimo de pista r?pida, bajo potente y p?blico fiel.",
    artistSlugs: ["ricardo-f", "frank-trax", "abel-k-kana", "dj-buffon"],
    classics: ["Chasis Resident", "The Noise Sindicate"],
  },
  {
    name: "Enjoy It Studios",
    slug: "enjoy-it-studios",
    city: "Barcelona",
    founded: 1987,
    description: "Estudio/sello de Julio Posadas. Producciones pioneras entre Max Music y la explosi?n m?kina.",
    history:
      "Enjoy It Studios fue el taller de Julio Posadas, productor clave que conect? la escena de los 80 con la m?kina de los 90. Muchos temas que acabar?an en Max Music o Bit Music pasaron por este estudio, marcando el sonido valenciano-barcelon?s antes del boom comercial.",
    artistSlugs: ["gerard-requena", "javi-aznar"],
    classics: ["Producciones Enjoy It"],
  },
  {
    name: "Previous Records",
    slug: "previous-records",
    city: "Barcelona",
    founded: 1999,
    description: "Archivo y reedici?n de cl?sicos m?kina/remember 90s para el revival.",
    history:
      "Previous Records naci? para rescatar masters olvidados de la m?kina catalana. David Con G y otros archiveros del g?nero publicaron reeditions digitales y vinilos que alimentaron la nueva ola de fiestas Remember y Makina Legends a partir de 2015.",
    artistSlugs: ["pastis", "buenri", "skudero"],
    classics: ["Reediciones Previous", "Archivo 90s"],
  },
  {
    name: "Uptempo",
    slug: "uptempo",
    city: "Barcelona",
    founded: 1998,
    description: "Sello hard/m?kina. Pastis & Buenri, Juan Mag?n y productores de la segunda ola.",
    history:
      "Uptempo apost? por tempos altos y est?tica m?s agresiva en la frontera entre hard trance y m?kina. Publicaciones de Pastis & Buenri y colaboradores de la escena Xque encontraron aqu? un canal comercial alternativo a Max Music.",
    artistSlugs: ["pastis", "buenri", "juan-cruz"],
    classics: ["Uptempo Series"],
  },
  {
    name: "DJ's At Work",
    slug: "djs-at-work",
    city: "Barcelona",
    founded: 1997,
    description: "Sello asociado a Pastis & Buenri y colaboradores (Ruboy, Uraken). Hard trance-m?kina.",
    history:
      "DJ's At Work document? las colaboraciones de estudio del d?o Pastis & Buenri con Ruboy, Uraken y otros productores de la ?rbita Xque. Remixes de Game Over y temas hard trance comerciales salieron bajo esta marca.",
    artistSlugs: ["pastis", "buenri", "ruboy"],
    classics: ["Game Over Remix", "DJ's At Work compilations"],
  },
  {
    name: "Pont Aeri",
    slug: "pont-aeri-records",
    city: "Barcelona",
    founded: 1996,
    description:
      "Recopilatorios de la ruta/discoteca Pont Aeri. Vol. 4 incluye Flying Free, el mayor ?xito comercial de la m?kina catalana.",
    history:
      "Pont Aeri Records recopil? la banda sonora de la m?tica ruta y discoteca del Vall?s. Los vol?menes Pont Aeri son objetos de culto: el Vol. 4 incluye Flying Free, tema que vendi? millones de copias y defini? el remember en toda Espa?a. Xavi Metralla, Skudero y decenas de DJs quedaron ligados a la marca.",
    artistSlugs: ["skudero", "xavi-metralla", "pastis", "buenri"],
    classics: ["Flying Free", "Pont Aeri Vol. 3", "Pont Aeri Vol. 4"],
  },
  {
    name: "SFERA Records",
    slug: "sfera-records",
    city: "Barcelona",
    founded: 2005,
    description: "Sello actual de Gerard Requena. Progressive, trance y legado del mayor productor m?kina.",
    history:
      "SFERA Records es la evoluci?n del legado de Gerard Requena tras la era Bit Music. Cyberspace y sus producciones posteriores encontraron aqu? continuidad en trance progresivo y m?kina revival, enlazando la pista de los 90 con festivales actuales.",
    artistSlugs: ["gerard-requena"],
    classics: ["Cyberspace", "SFERA releases"],
  },
];

export const MAKINA_LABELS_BY_SLUG = new Map(
  MAKINA_LABELS.map((label) => [label.slug, label])
);
