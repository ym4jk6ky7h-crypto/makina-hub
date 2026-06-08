import { ANALYZR_DEMO, ANALYZR_NAME } from "@/lib/analyzr/config";
import { cn } from "@/lib/utils";

type AnalyzrPhoneMockupProps = {
  className?: string;
  size?: "md" | "lg";
};

const VU_HEIGHTS = [
  28, 45, 62, 38, 55, 72, 48, 65, 42, 58, 75, 50, 68, 44, 60, 78, 52, 70, 46, 63, 80, 54, 71, 48,
];

export function AnalyzrPhoneMockup({ className, size = "lg" }: AnalyzrPhoneMockupProps) {
  const demo = ANALYZR_DEMO;

  return (
    <div
      className={cn(
        "relative mx-auto",
        size === "lg" ? "w-[min(100%,280px)]" : "w-[min(100%,240px)]",
        className
      )}
      aria-hidden
    >
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-makina-cyan/30 via-makina-purple/20 to-makina-pink/30 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[#0a0a12] p-2 shadow-2xl shadow-black/60 ring-1 ring-white/10">
        <div className="rounded-[1.5rem] border border-white/5 bg-[#12121c] px-4 pb-6 pt-10">
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-white/20" />
          <p className="text-center font-display text-lg font-bold tracking-[0.25em] text-white">
            {ANALYZR_NAME.toUpperCase()}
          </p>
          <p className="mt-1 text-center text-[10px] uppercase tracking-widest text-makina-cyan/80">
            Offline DJ Analysis
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-makina-pink/30 bg-makina-pink/10 p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-makina-pink">BPM</p>
              <p className="font-display text-3xl font-extrabold text-white">{demo.bpm}</p>
            </div>
            <div className="rounded-xl border border-makina-purple/30 bg-makina-purple/10 p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-makina-purple">Key</p>
              <p className="font-display text-3xl font-extrabold text-white">{demo.key}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-makina-cyan/30 bg-makina-cyan/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-makina-cyan">
              Structure
            </p>
            <p className="mt-1 break-all font-mono text-sm font-semibold text-white">
              {demo.structure}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px]">
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-medium text-emerald-400">
              {demo.quality}
            </span>
            <span className="text-muted-foreground">{demo.confidence}% conf.</span>
          </div>

          <div className="mt-5 flex gap-2">
            <div className="h-9 flex-1 rounded-lg bg-red-600/90" />
            <div className="h-9 w-9 rounded-lg border border-white/15 bg-white/5" />
          </div>

          <div className="mt-4 flex h-8 items-end gap-0.5">
            {VU_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-makina-pink/80 to-makina-cyan/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
