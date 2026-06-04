import Image from "next/image";
import Link from "next/link";
import { DiscAlbum } from "lucide-react";
import type { LabelWithRelations } from "@/types/database";

type LabelCardProps = {
  label: LabelWithRelations;
};

export function LabelCard({ label }: LabelCardProps) {
  return (
    <Link
      href={`/sellos/${label.slug}`}
      className="group glass-card p-6 transition-colors hover:bg-secondary/80"
    >
      <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-xl bg-gradient-to-br from-makina-gold/20 to-makina-pink/20">
        {label.logo_url ? (
          <Image
            src={label.logo_url}
            alt={`Logo ${label.name}`}
            fill
            className="object-contain p-1"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <DiscAlbum className="h-8 w-8 text-makina-gold" />
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold">{label.name}</h3>
      {label.founded_year && (
        <p className="mt-1 text-sm text-muted-foreground">
          Fundado en {label.founded_year}
        </p>
      )}
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
        {label.description}
      </p>
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span>{label.tracks?.length ?? 0} lanzamientos</span>
        <span>{label.artists?.length ?? 0} artistas</span>
      </div>
    </Link>
  );
}
