import { Badge } from "@/components/ui/badge";
import { formatGenre } from "@/lib/utils";
import type { Genre, Track } from "@/types/database";

type ArtistMetaChipsProps = {
  city: string | null;
  country: string | null;
  tracks: Pick<Track, "genre" | "bpm">[];
};

export function deriveArtistMeta(tracks: Pick<Track, "genre" | "bpm">[]) {
  const genreCounts = new Map<Genre, number>();
  const bpms: number[] = [];
  for (const t of tracks) {
    genreCounts.set(t.genre, (genreCounts.get(t.genre) ?? 0) + 1);
    if (t.bpm != null) bpms.push(t.bpm);
  }
  const genres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([g]) => g);
  const bpm =
    bpms.length > 0
      ? Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length)
      : null;
  return { genres, bpm };
}

export function ArtistMetaChips({ city, country, tracks }: ArtistMetaChipsProps) {
  const { genres, bpm } = deriveArtistMeta(tracks);
  const location = [city, country].filter(Boolean).join(" · ");

  if (!location && genres.length === 0 && bpm == null) return null;

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
      {location && (
        <Badge variant="outline" className="border-white/15">
          {location}
        </Badge>
      )}
      {genres.map((g) => (
        <Badge key={g} variant="genre">
          {formatGenre(g)}
        </Badge>
      ))}
      {bpm != null && (
        <Badge variant="outline" className="border-makina-cyan/30 text-makina-cyan">
          ~{bpm} BPM
        </Badge>
      )}
    </div>
  );
}
