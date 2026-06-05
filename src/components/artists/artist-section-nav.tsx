import { cn } from "@/lib/utils";

type ArtistSectionNavProps = {
  hasPlayer: boolean;
  trackCount: number;
  sessionCount: number;
};

const links = (
  hasPlayer: boolean,
  trackCount: number,
  sessionCount: number
) =>
  [
    hasPlayer && { href: "#reproductor", label: "Escuchar" },
    { href: "#canciones", label: `Canciones${trackCount ? ` (${trackCount})` : ""}` },
    { href: "#sesiones", label: `Sesiones${sessionCount ? ` (${sessionCount})` : ""}` },
    { href: "#bio", label: "Biografía" },
  ].filter(Boolean) as { href: string; label: string }[];

export function ArtistSectionNav({
  hasPlayer,
  trackCount,
  sessionCount,
}: ArtistSectionNavProps) {
  const items = links(hasPlayer, trackCount, sessionCount);

  return (
    <nav
      className="sticky top-16 z-30 -mx-4 mb-8 flex gap-2 overflow-x-auto border-b border-white/10 bg-background/90 px-4 py-3 backdrop-blur-md scrollbar-hide lg:top-0 lg:mx-0 lg:rounded-xl lg:border lg:px-3"
      aria-label="Secciones del artista"
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "shrink-0 rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium",
            "text-muted-foreground transition-colors hover:border-makina-pink/40 hover:text-makina-pink"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
