/** Utilidades de biografía (solo servidor / compartido). */
export function parseProductionsFromBio(biography: string): string[] {
  const match = biography.match(/referentes destacan ([^.]+)\./i);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function parseParagraphs(biography: string): string[] {
  return biography
    .replace(/\*\*[^*]+\*\*/g, "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);
}
