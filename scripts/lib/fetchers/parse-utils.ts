export const UA = "MakinaHub/1.0 (educational music database; +https://makina-hub.vercel.app)";

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** DD/MM/YYYY → YYYY-MM-DD */
export function parseSpanishDate(raw: string): string | null {
  const m = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  const d = m[1].padStart(2, "0");
  const mo = m[2].padStart(2, "0");
  return `${m[3]}-${mo}-${d}`;
}

export function slugify(text: string, max = 80): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, max);
}

export function extractMeta(html: string, prop: string): string | null {
  const patterns = [
    new RegExp(`property="${prop}"\\s+content="([^"]+)"`, "i"),
    new RegExp(`content="([^"]+)"\\s+property="${prop}"`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1].replace(/&amp;/g, "&").replace(/&#8211;/g, "-").trim();
  }
  return null;
}

const CITY_HINTS: Array<{ pattern: RegExp; city: string }> = [
  { pattern: /barcelona/i, city: "Barcelona" },
  { pattern: /sabadell/i, city: "Sabadell" },
  { pattern: /terrassa/i, city: "Terrassa" },
  { pattern: /molins de rei/i, city: "Molins de Rei" },
  { pattern: /mollet/i, city: "Mollet del Vallès" },
  { pattern: /girona/i, city: "Girona" },
  { pattern: /lleida/i, city: "Lleida" },
  { pattern: /reus/i, city: "Reus" },
  { pattern: /montmel[oó]/i, city: "Montmeló" },
  { pattern: /vic\b/i, city: "Vic" },
  { pattern: /platja d'aro|platja d&#8217;aro/i, city: "Platja d'Aro" },
  { pattern: /empuriabrava/i, city: "Empuriabrava" },
  { pattern: /viladecans/i, city: "Viladecans" },
  { pattern: /granollers/i, city: "Granollers" },
  { pattern: /tarragona/i, city: "Tarragona" },
  { pattern: /rub[ií]/i, city: "Rubí" },
];

export function guessCity(text: string): string {
  for (const { pattern, city } of CITY_HINTS) {
    if (pattern.test(text)) return city;
  }
  return "Barcelona";
}

export function guessVenue(description: string, title: string): string {
  const clean = description.replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  const afterDate = clean.replace(/^\d{1,2}\/\d{1,2}\/\d{4}[^A-Za-zÀ-ÿ]*/, "");
  const chunk = afterDate.split(/Ticket|Price|Cart|Edad/i)[0]?.trim() ?? "";
  const venue = chunk.replace(/\s*-\s*C\//i, " — ").trim();
  if (venue.length > 3 && venue.length < 120) return venue;
  const paren = title.match(/\(([^)]+)\)/);
  if (paren) return paren[1];
  return title.split("—")[0]?.trim() || "Por confirmar";
}
