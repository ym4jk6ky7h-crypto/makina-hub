import OpenAI from "openai";
import type { MakinaArtistSeed } from "../../data/makina-artists";

export type AiArtistEnrichment = {
  slug: string;
  extendedOrigins: string;
  extendedPeak: string;
  extendedToday: string;
  style: string;
  legacy: string;
  productions: string[];
  instagramUrl: string | null;
  facebookUrl: string | null;
  realName: string | null;
  imageSearchTerms: string[];
};

const SYSTEM = `Eres un historiador experto en la música mákina y remember catalana (años 90-2000).
Responde SOLO con JSON válido, sin markdown. Usa hechos verificables sobre DJs catalanes de mákina.
Si no hay datos concretos, describe el contexto de la escena (Pont Aeri, Chasis, Xque, Bit Music) sin inventar fechas exactas.
Idioma: español.`;

export async function enrichArtistWithOpenAI(
  seed: MakinaArtistSeed,
  apiKey: string
): Promise<AiArtistEnrichment> {
  const client = new OpenAI({ apiKey });

  const prompt = `Artista: ${seed.name}
Slug: ${seed.slug}
Ciudad: ${seed.city}
Activo desde: ${seed.activeFrom}
Salas: ${seed.venues?.join(", ") ?? "desconocidas"}
Clásicos conocidos: ${seed.classics?.join(", ") ?? "ninguno listado"}
Bio curada orígenes: ${seed.bio.origins}
Bio curada época dorada: ${seed.bio.peak}
Bio curada actualidad: ${seed.bio.today}

Genera JSON con:
{
  "extendedOrigins": "2-3 frases ampliadas sobre orígenes",
  "extendedPeak": "2-3 frases sobre época dorada y estilo",
  "extendedToday": "2 frases sobre situación actual",
  "style": "1-2 frases describiendo su sonido (hard melódico, bouncy, etc.)",
  "legacy": "1-2 frases sobre su legado en la escena catalana",
  "productions": ["tema1", "tema2"] (temas reales o sesiones conocidas; máximo 6),
  "instagramUrl": "url completa o null",
  "facebookUrl": "url completa o null",
  "realName": "nombre real si se conoce o null",
  "imageSearchTerms": ["término búsqueda foto", "..."]
}`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as Partial<AiArtistEnrichment>;

  return {
    slug: seed.slug,
    extendedOrigins: parsed.extendedOrigins ?? seed.bio.origins,
    extendedPeak: parsed.extendedPeak ?? seed.bio.peak,
    extendedToday: parsed.extendedToday ?? seed.bio.today,
    style: parsed.style ?? "",
    legacy: parsed.legacy ?? "",
    productions: Array.isArray(parsed.productions) ? parsed.productions.slice(0, 8) : [],
    instagramUrl: parsed.instagramUrl ?? null,
    facebookUrl: parsed.facebookUrl ?? null,
    realName: parsed.realName ?? null,
    imageSearchTerms: Array.isArray(parsed.imageSearchTerms)
      ? parsed.imageSearchTerms
      : [seed.name, seed.wikipediaSearch],
  };
}
