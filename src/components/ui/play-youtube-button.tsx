import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type PlayYoutubeButtonProps = {
  href: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function PlayYoutubeButton({
  href,
  label = "Escuchar",
  size = "md",
  className,
}: PlayYoutubeButtonProps) {
  const iconOnly = !label;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || "Escuchar en YouTube"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-red-600 font-semibold text-white shadow-lg shadow-red-900/30 transition-transform hover:scale-105 hover:bg-red-500 active:scale-95",
        iconOnly && size === "sm" && "h-10 w-10",
        iconOnly && size === "md" && "h-11 w-11",
        !iconOnly && size === "sm" && "h-9 gap-1.5 px-3 text-xs",
        !iconOnly && size === "md" && "h-11 gap-2 px-4 text-sm",
        !iconOnly && size === "lg" && "h-12 gap-2 px-5 text-base",
        className
      )}
    >
      <Play
        className={cn(
          "fill-white",
          iconOnly ? "h-5 w-5" : size === "sm" ? "h-4 w-4" : "h-5 w-5"
        )}
      />
      {label ? <span>{label}</span> : null}
    </a>
  );
}

/** Overlay de play sobre miniatura (visible en móvil, hover en desktop) */
export function PlayThumbnailOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg sm:h-14 sm:w-14">
        <Play className="h-6 w-6 fill-white text-white sm:h-7 sm:w-7" />
      </div>
    </div>
  );
}
