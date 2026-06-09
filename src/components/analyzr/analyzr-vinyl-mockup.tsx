import { ANALYZR_VINYL_DEMO, ANALYZR_VINYL_NAME } from "@/lib/analyzr/config";
import { cn } from "@/lib/utils";
import { Disc3, Music2 } from "lucide-react";

type AnalyzrVinylMockupProps = {
  className?: string;
  size?: "md" | "lg";
};

export function AnalyzrVinylMockup({ className, size = "lg" }: AnalyzrVinylMockupProps) {
  const demo = ANALYZR_VINYL_DEMO;

  return (
    <div
      className={cn(
        "relative mx-auto",
        size === "lg" ? "w-[min(100%,300px)]" : "w-[min(100%,260px)]",
        className
      )}
      aria-hidden
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-makina-gold/25 via-makina-pink/15 to-makina-purple/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-makina-gold/30 bg-[#0a0a12] p-5 shadow-2xl shadow-black/60">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-sm font-bold tracking-wider text-makina-gold">
            {ANALYZR_VINYL_NAME}
          </p>
          <Disc3 className="h-5 w-5 animate-spin text-makina-pink [animation-duration:8s]" />
        </div>

        <div className="flex gap-4">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-makina-pink/40 to-makina-purple/30 ring-2 ring-makina-gold/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <Music2 className="h-10 w-10 text-white/40" />
            </div>
            <div className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-makina-gold">
              VINYL
            </div>
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="truncate font-display text-lg font-bold leading-tight">{demo.title}</p>
            <p className="text-sm text-makina-pink">{demo.artist}</p>
            <p className="mt-2 text-xs text-muted-foreground">{demo.label} · {demo.year}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-makina-cyan/15 px-2 py-0.5 text-[10px] font-semibold text-makina-cyan">
                {demo.bpm} BPM
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
                {demo.genre}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                En colección
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
          {["Pastis — Universo Makina", "Konik — Limite Edición"].map((row) => (
            <div
              key={row}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-makina-gold" />
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** @deprecated Usar AnalyzrVinylMockup */
export const AnalyzrPhoneMockup = AnalyzrVinylMockup;
