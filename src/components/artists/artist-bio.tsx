type ArtistBioProps = {
  biography: string;
};

/** Biografía en prosa (3–4 párrafos), sin mini-apartados repetitivos. */
export function ArtistBio({ biography }: ArtistBioProps) {
  const paragraphs = biography
    .replace(/\*\*[^*]+\*\*/g, "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40)
    .slice(0, 4);

  if (paragraphs.length === 0) {
    return (
      <p className="text-base leading-relaxed text-muted-foreground italic">
        Biografía en preparación.
      </p>
    );
  }

  return (
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function parseProductionsFromBio(biography: string): string[] {
  const match = biography.match(/referentes destacan ([^.]+)\./i);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
