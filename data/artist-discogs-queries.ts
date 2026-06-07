/** Consultas Discogs por slug (evita confundir DJ con sellos o compilaciones). */
export const ARTIST_DISCOGS_QUERIES: Record<string, string> = {
  pastis: "Pastis Buenri DJ",
  buenri: "Buenri DJ makina",
  skudero: "Skudero DJ",
  "xavi-metralla": "Xavi Metralla DJ",
  konik: "DJ Konik makina",
  "gerard-requena": "Gerard Requena Cyberspace",
  "mike-platinas": "Mike Platinas DJ",
  "quique-tejada": "Quique Tejada DJ",
  "xavi-bcn": "Xavi BCN DJ makina",
  neil: "Neil DJ makina Barcelona",
  "fran-bit": "Fran Bit DJ",
  markos13: "Markos13 DJ makina",
  "alberto-tapia": "Alberto Tapia DJ",
  richard: "Richard DJ makina Barcelona",
};

export function discogsSearchQuery(slug: string, displayName: string): string {
  return ARTIST_DISCOGS_QUERIES[slug] ?? `${displayName} DJ makina catalana`;
}
