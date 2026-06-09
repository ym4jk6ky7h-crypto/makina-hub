import Link from "next/link";
import { ArrowRight, Check, Crown, Disc3, Download } from "lucide-react";
import { AnalyzrVinylMockup } from "@/components/analyzr/analyzr-vinyl-mockup";
import { Button } from "@/components/ui/button";
import {
  ANALYZR_COMING_SOON_NOTE,
  ANALYZR_VINYL_DESCRIPTION,
  ANALYZR_VINYL_FEATURES,
  ANALYZR_VINYL_NAME,
  ANALYZR_VINYL_PATH,
  ANALYZR_VINYL_TAGLINE,
  getAnalyzrVinylTiers,
} from "@/lib/analyzr/config";

export function HomeAnalyzrShowcase() {
  const tiers = getAnalyzrVinylTiers();
  const freeTier = tiers.find((t) => t.id === "free")!;
  const proTier = tiers.find((t) => t.id === "pro")!;

  return (
    <section
      id="analyzr-vinyl"
      className="relative overflow-hidden border-y border-makina-gold/25 bg-[#080810]"
      aria-labelledby="analyzr-vinyl-showcase-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(251,191,36,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_20%,rgba(255,45,106,0.1),transparent)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <p className="mb-6 text-center text-sm text-muted-foreground lg:text-left">
          {ANALYZR_COMING_SOON_NOTE}
        </p>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-makina-gold/40 bg-makina-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-makina-gold">
              <Disc3 className="h-3.5 w-3.5" />
              Vinilo · Makina Hub
            </div>
            <h2
              id="analyzr-vinyl-showcase-title"
              className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              <span className="text-gradient-makina">{ANALYZR_VINYL_NAME}</span>
              <span className="mt-2 block text-2xl font-bold text-white/90 sm:text-3xl">
                {ANALYZR_VINYL_TAGLINE}
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {ANALYZR_VINYL_DESCRIPTION}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {ANALYZR_VINYL_FEATURES.slice(0, 4).map((f) => (
                <li key={f.title} className="flex gap-2 text-sm text-white/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-makina-gold" />
                  <span>
                    <strong className="text-white">{f.title}.</strong> {f.description}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" variant="makina" className="h-12 gap-2 text-base">
                <Link href={freeTier.href ?? ANALYZR_VINYL_PATH}>
                  <Download className="h-5 w-5" />
                  {freeTier.cta}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 gap-2 border-makina-gold/40 bg-makina-gold/5 text-makina-gold hover:bg-makina-gold/10"
              >
                <Link href={proTier.href ?? `${ANALYZR_VINYL_PATH}#pro`}>
                  <Crown className="h-5 w-5" />
                  {proTier.cta}
                </Link>
              </Button>
            </div>

            <Link
              href={ANALYZR_VINYL_PATH}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-makina-gold hover:underline"
            >
              Más sobre Analyzr Vinyl — Gratis vs Pro
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <AnalyzrVinylMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
