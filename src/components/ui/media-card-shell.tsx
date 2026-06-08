import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MediaCardAccent = "event" | "artist" | "session" | "release";

type MediaCardShellProps = {
  children: ReactNode;
  className?: string;
  accent?: MediaCardAccent;
};

const accentStyles: Record<MediaCardAccent, string> = {
  event:
    "hover:border-makina-cyan/40 hover:shadow-makina-cyan/10 hover:shadow-xl",
  artist:
    "hover:border-makina-pink/40 hover:shadow-makina-glow-sm hover:shadow-xl",
  session:
    "hover:border-makina-purple/40 hover:shadow-makina-purple/10 hover:shadow-xl",
  release:
    "hover:border-makina-gold/40 hover:shadow-makina-gold/10 hover:shadow-xl",
};

/** Contenedor unificado para tarjetas con imagen (artistas, eventos, sesiones, novedades). */
export function MediaCardShell({
  children,
  className,
  accent = "event",
}: MediaCardShellProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-card/70 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300",
        accentStyles[accent],
        className
      )}
    >
      {children}
    </article>
  );
}
