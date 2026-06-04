import { cn } from "@/lib/utils";

type MakinaPlaceholderProps = {
  aspect?: "square" | "video" | "poster" | "wide";
  className?: string;
  /** Rellena el contenedor padre (sin aspect ratio propio) */
  fill?: boolean;
};

const aspectClass = {
  square: "aspect-square",
  video: "aspect-video",
  poster: "aspect-[3/4]",
  wide: "aspect-[16/10]",
} as const;

export function MakinaPlaceholder({
  aspect = "poster",
  className,
  fill = false,
}: MakinaPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-makina-pink/25 via-makina-purple/20 to-makina-cyan/15",
        !fill && aspectClass[aspect],
        fill && "h-full w-full",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-makina-pink via-makina-purple to-makina-cyan font-display text-sm font-bold text-white shadow-lg shadow-makina-pink/20">
          MH
        </span>
      </div>
    </div>
  );
}
