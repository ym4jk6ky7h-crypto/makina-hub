import type { MakinaArtistBio } from "../../../data/makina-artists";

export type BioFormatInput = {
  name: string;
  city: string;
  country?: string;
  activeFrom: number;
  classics?: string[];
  bio: MakinaArtistBio;
  realName?: string | null;
  wikiExtract?: string;
  wikiTitle?: string;
  discogsProfile?: string | null;
  ai?: {
    extendedOrigins?: string;
    extendedPeak?: string;
    extendedToday?: string;
    style?: string;
    legacy?: string;
    productions?: string[];
  } | null;
};

function isRelevantWiki(extract: string, name: string): boolean {
  const parts = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((p) => p.length > 2);
  const text = extract
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const nameHit = parts.some((p) => text.includes(p));
  const topicHit =
    /músic|dj|productor|disc jockey|electr|dance|techno|hardcore|remember|makina/i.test(
      extract
    );
  return nameHit && topicHit;
}

function firstNameToken(name: string): string {
  return name.split(/[\s&]+/)[0]?.toLowerCase() ?? "";
}

function originsMentionRealName(origins: string, realName: string | null | undefined): boolean {
  if (!realName) return true;
  const token = firstNameToken(realName);
  return token.length > 2 && origins.toLowerCase().includes(token);
}

/** Biografía estructurada a partir del catálogo curado + fuentes externas. */
export function formatArtistBiography(input: BioFormatInput): string {
  const origins = input.ai?.extendedOrigins ?? input.bio.origins;
  const peak = input.ai?.extendedPeak ?? input.bio.peak;
  const today = input.ai?.extendedToday ?? input.bio.today;

  const parts: string[] = [];

  if (input.realName && !originsMentionRealName(origins, input.realName)) {
    parts.push(
      `${input.name} (${input.realName}) — ${input.city}, ${input.country ?? "España"}. Activo desde ${input.activeFrom}.`
    );
  }

  parts.push(`**Orígenes.** ${origins}`);

  if (input.ai?.style?.trim()) {
    parts.push(`**Estilo.** ${input.ai.style.trim()}`);
  }

  parts.push(`**Época dorada.** ${peak}`);

  const classics = [...new Set([...(input.ai?.productions ?? []), ...(input.classics ?? [])])];
  if (classics.length > 0) {
    parts.push(`**Producciones.** ${classics.slice(0, 8).join(", ")}.`);
  }

  parts.push(`**Actualidad.** ${today}`);

  if (input.ai?.legacy?.trim()) {
    parts.push(`**Legado.** ${input.ai.legacy.trim()}`);
  }

  if (
    input.wikiExtract &&
    isRelevantWiki(input.wikiExtract, input.name)
  ) {
    const snippet = input.wikiExtract.replace(/\s+/g, " ").trim().slice(0, 700);
    const ref = input.wikiTitle ? ` (${input.wikiTitle})` : "";
    parts.push(`**Referencia Wikipedia${ref}.** ${snippet}`);
  }

  if (input.discogsProfile && input.discogsProfile.length > 60) {
    const snippet = input.discogsProfile.replace(/\s+/g, " ").trim().slice(0, 450);
    if (!origins.includes(snippet.slice(0, 50))) {
      parts.push(`**Perfil Discogs.** ${snippet}`);
    }
  }

  return parts.join("\n\n").slice(0, 8000);
}
