import Image from "next/image";
import Link from "next/link";
import { DiscAlbum, MapPin } from "lucide-react";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
import type { LabelWithRelations } from "@/types/database";

type LabelCardProps = {
  label: LabelWithRelations;
};

function labelLogoUrl(name: string, logoUrl?: string | null): string {
  if (logoUrl?.trim()) return logoUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=1a1020&color=e8b84a&bold=true&format=png`;
}

export function LabelCard({ label }: LabelCardProps) {
  const logo = labelLogoUrl(label.name, label.logo_url);

  return (
    <Link
      href={`/sellos/${label.slug}`}
      className="group glass-card overflow-hidden transition-colors hover:border-makina-gold/30"
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-makina-gold/20 via-makina-purple/10 to-makina-pink/10">
        <Image
          src={logo}
          alt={`Logo ${label.name}`}
          fill
          className="object-contain p-6 transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 480px"
          unoptimized={preferUnoptimizedImage(logo)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-xl font-bold text-white">{label.name}</h3>
          {label.founded_year && (
            <p className="mt-0.5 text-xs text-white/75">Desde {label.founded_year}</p>
          )}
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-3 text-sm text-muted-foreground">{label.description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-makina-gold">
          <DiscAlbum className="h-3.5 w-3.5" />
          Ver historia del sello
        </div>
      </div>
    </Link>
  );
}
