import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MediaCardShellProps = {
  children: ReactNode;
  className?: string;
};

/** Contenedor unificado para tarjetas con imagen (artistas, eventos, música, sesiones). */
export function MediaCardShell({ children, className }: MediaCardShellProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-card/70 shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-makina-pink/30",
        className
      )}
    >
      {children}
    </article>
  );
}
