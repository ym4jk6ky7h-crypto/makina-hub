import Image from "next/image";
import Link from "next/link";
import type { VinylWithRelations } from "@/types/database";
import { Badge } from "@/components/ui/badge";

const rarityLabels: Record<string, string> = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  legendary: "Legendario",
};

const rarityColors: Record<string, string> = {
  common: "bg-zinc-500/20 text-zinc-400",
  uncommon: "bg-blue-500/20 text-blue-400",
  rare: "bg-makina-gold/20 text-makina-gold",
  legendary: "bg-makina-pink/20 text-makina-pink",
};

type VinylCardProps = {
  vinyl: VinylWithRelations;
};

export function VinylCard({ vinyl }: VinylCardProps) {
  return (
    <Link
      href={`/vinilos/${vinyl.slug}`}
      className="group glass-card overflow-hidden transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-square bg-secondary">
        {vinyl.cover_url ? (
          <Image
            src={vinyl.cover_url}
            alt={vinyl.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sin portada
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Badge
            className={`text-[10px] ${rarityColors[vinyl.rarity]}`}
            variant="outline"
          >
            {rarityLabels[vinyl.rarity]}
          </Badge>
          {vinyl.estimated_value != null && (
            <span className="text-sm font-semibold text-makina-gold">
              {vinyl.estimated_value}€
            </span>
          )}
        </div>
        <h3 className="line-clamp-1 font-semibold">{vinyl.title}</h3>
        <p className="text-sm text-muted-foreground">{vinyl.artist?.name}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {vinyl.catalog_number}
        </p>
      </div>
    </Link>
  );
}
