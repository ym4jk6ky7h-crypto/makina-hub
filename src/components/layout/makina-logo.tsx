import { cn } from "@/lib/utils";

type MakinaLogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

export function MakinaLogo({
  size = "md",
  showText = true,
  className,
}: MakinaLogoProps) {
  const iconSize = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-lg" : "h-9 w-9 text-sm";
  const textSize = size === "lg" ? "text-xl" : "text-base";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-makina-pink via-makina-purple to-makina-cyan font-display font-extrabold text-white shadow-lg shadow-makina-pink/30 ring-1 ring-white/20",
          iconSize
        )}
        aria-hidden
      >
        <span className="absolute inset-0 rounded-xl bg-card-shine opacity-50" />
        <span className="relative">MH</span>
      </span>
      {showText && (
        <span className={cn("font-display font-bold tracking-tight", textSize)}>
          Makina{" "}
          <span className="text-gradient-makina">Hub</span>
        </span>
      )}
    </span>
  );
}
