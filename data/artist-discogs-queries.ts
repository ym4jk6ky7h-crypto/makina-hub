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
  "frank-trax": "Frank T.R.A.X. makina",
  chumi: "Chumi DJ makina",
  "julio-navas": "Julio Navas DJ",
  "dj-buffon": "Buffon DJ makina",
  "toni-peret": "Toni Peret DJ",
  "nando-dixkontrol": "Nando Dixkontrol DJ",
  gollum: "DJ Gollum hardcore",
  "scott-brown": "Scott Brown musician hardcore",
  "darren-styles": "Darren Styles hardcore",
  "ricardo-f": "Ricardo F DJ makina",
};

export function discogsSearchQuery(slug: string, displayName: string): string {
  return ARTIST_DISCOGS_QUERIES[slug] ?? `${displayName} DJ makina catalana`;
}
