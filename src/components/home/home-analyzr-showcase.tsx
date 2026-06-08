import Link from "next/link";
import {
  ArrowRight,
  AudioWaveform,
  Check,
  Crown,
  Download,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnalyzrPhoneMockup } from "@/components/analyzr/analyzr-phone-mockup";
import { Button } from "@/components/ui/button";
import {
  ANALYZR_DESCRIPTION,
  ANALYZR_FEATURES,
  ANALYZR_NAME,
  ANALYZR_TAGLINE,
  getAnalyzrTiers,
} from "@/lib/analyzr/config";

export function HomeAnalyzrShowcase() {
  const tiers = getAnalyzrTiers();
  const freeTier = tiers.find((t) => t.id === "free")!;
  const proTier = tiers.find((t) => t.id === "pro")!;

  return (
    <section
      id="analyzr"
      className="relative overflow-hidden border-y border-makina-cyan/20 bg-[#080810]"
      aria-labelledby="analyzr-showcase-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(34,211,238,0.14),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_20%,rgba(255,45,106,0.12),transparent)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-makina-cyan/40 bg-makina-cyan/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-makina-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              App para DJs · iPhone
            </div>
            <h2
              id="analyzr-showcase-title"
              className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Conoce{" "}
              <span className="text-gradient-makina">{ANALYZR_NAME}</span>
              <span className="mt-2 block text-2xl font-bold text-white/90 sm:text-3xl">
                {ANALYZR_TAGLINE}
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {ANALYZR_DESCRIPTION} La herramienta que faltaba en la escena mákina: precisión de
              cabina, privacidad total y cero dependencia de internet.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {ANALYZR_FEATURES.slice(0, 4).map((f) => (
                <li key={f.title} className="flex gap-2 text-sm text-white/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-makina-cyan" />
                  <span>
                    <strong className="text-white">{f.title}.</strong> {f.description}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" variant="makina" className="h-12 gap-2 text-base">
                <Link href={freeTier.href ?? "/analyzr"}>
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
                <Link href={proTier.href ?? "/analyzr#pro"}>
                  <Crown className="h-5 w-5" />
                  {proTier.cta} — {proTier.price}
                </Link>
              </Button>
            </div>

            <Link
              href="/analyzr"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-makina-cyan hover:underline"
            >
              Ver demo, comparativa Gratis vs Pro y requisitos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <AnalyzrPhoneMockup />
            <div className="absolute -left-2 top-8 hidden rounded-xl border border-makina-pink/30 bg-black/60 px-3 py-2 text-xs font-semibold text-makina-pink backdrop-blur-md lg:block">
              <Zap className="mr-1 inline h-3.5 w-3.5" />
              175 BPM · Makina
            </div>
            <div className="absolute -right-2 bottom-16 hidden rounded-xl border border-makina-cyan/30 bg-black/60 px-3 py-2 text-xs font-semibold text-makina-cyan backdrop-blur-md lg:block">
              <AudioWaveform className="mr-1 inline h-3.5 w-3.5" />
              100 % local
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
