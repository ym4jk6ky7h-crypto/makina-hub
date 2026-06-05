/** Utilidades de biografía (servidor y cliente). */

export type BioSection = {
  title?: string;
  body: string;
};

export function parseProductionsFromBio(biography: string): string[] {
  const structured = biography.match(/\*\*Producciones\.\*\*\s*([^\n]+)/i);
  if (structured) {
    return structured[1]
      .replace(/\.$/, "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const legacy = biography.match(/referentes destacan ([^.]+)\./i);
  if (!legacy) return [];
  return legacy[1]
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function parseBioSections(biography: string): BioSection[] {
  if (!biography.trim()) return [];

  const withMarkers = biography.replace(
    /\*\*([^*]+)\.\*\*/g,
    "\n\n§$1§\n"
  );

  return withMarkers
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter((block) => block.length > 20)
    .map((block) => {
      const sectionMatch = block.match(/^§([^§]+)§\s*([\s\S]*)$/);
      if (sectionMatch) {
        return {
          title: sectionMatch[1].trim(),
          body: sectionMatch[2].trim(),
        };
      }
      return { body: block.replace(/^§|§$/g, "").trim() };
    })
    .filter((s) => s.body.length > 0);
}

export function parseParagraphs(biography: string): string[] {
  const sections = parseBioSections(biography);
  if (sections.length > 0) {
    return sections.map((s) =>
      s.title ? `${s.title}. ${s.body}` : s.body
    );
  }

  return biography
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);
}
