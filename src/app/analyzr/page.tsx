import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Crown,
  Download,
  Mic,
  Shield,
  Smartphone,
  X,
} from "lucide-react";
import { AnalyzrPhoneMockup } from "@/components/analyzr/analyzr-phone-mockup";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  ANALYZR_DESCRIPTION,
  ANALYZR_FEATURES,
  ANALYZR_NAME,
  ANALYZR_REQUIREMENTS,
  ANALYZR_STEPS,
  ANALYZR_TAGLINE,
  getAnalyzrTiers,
} from "@/lib/analyzr/config";
import { SITE_IMAGES } from "@/lib/site-images";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: `${ANALYZR_NAME} — Análisis DJ offline`,
  description: ANALYZR_DESCRIPTION,
  path: "/analyzr",
});

export default function AnalyzrPage() {
  const tiers = getAnalyzrTiers();
  const freeTier = tiers.find((t) => t.id === "free")!;
  const proTier = tiers.find((t) => t.id === "pro")!;

  return (
    <>
      <PageHero
        title={ANALYZR_NAME}
        subtitle={ANALYZR_TAGLINE}
        image={SITE_IMAGES.heroHome}
        badge="App iOS · 100 % offline"
        accent="events"
      />

      <section className="relative overflow-hidden border-b border-white/5 py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(34,211,238,0.1),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">{ANALYZR_DESCRIPTION}</p>
            <p className="mt-4 text-muted-foreground">
              Diseñada para la escena <strong className="text-foreground">mákina y hard dance</strong>:
              detecta BPM alrededor de 170–180, tonalidad aproximada y estructura en notación de
              cabina como <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-sm text-makina-cyan">8)4(2)4(2)8)16</code>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="makina" className="gap-2">
                <Link href={freeTier.href ?? "#descargar"}>
                  <Download className="h-5 w-5" />
                  {freeTier.cta}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-makina-gold/40 text-makina-gold"
              >
                <Link href={proTier.href ?? "#pro"}>
                  <Crown className="h-5 w-5" />
                  {proTier.cta}
                </Link>
              </Button>
            </div>
          </div>
          <AnalyzrPhoneMockup className="lg:justify-self-end" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight">Cómo funciona</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Tres pasos. Sin curva de aprendizaje. Pensado para el momento en que necesitas datos
          rápidos antes de mezclar.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {ANALYZR_STEPS.map((s) => (
            <div
              key={s.step}
              className="glass-card rounded-2xl border-makina-cyan/10 p-6"
            >
              <span className="font-mono text-2xl font-bold text-makina-cyan">{s.step}</span>
              <h3 className="mt-3 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-card/30 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight">Por qué Analyzr</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ANALYZR_FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-background/50 p-5">
                <h3 className="font-semibold text-makina-cyan">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pro" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Elige tu versión
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Empieza gratis en cabina. Pasa a Pro cuando quieras historial, estructura completa y
            todas las herramientas.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 sm:p-8",
                tier.highlighted
                  ? "border-makina-gold/40 bg-gradient-to-b from-makina-gold/10 to-transparent shadow-lg shadow-makina-gold/5"
                  : "border-white/10 bg-card/50"
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-makina-gold px-3 py-0.5 text-xs font-bold uppercase text-black">
                  Recomendado
                </span>
              )}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
                <span className="font-display text-3xl font-extrabold">{tier.price}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{tier.priceNote}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-makina-cyan" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className={cn(
                  "mt-8 w-full gap-2",
                  tier.highlighted
                    ? "bg-gradient-to-r from-makina-gold to-makina-pink text-black hover:opacity-90"
                    : ""
                )}
                variant={tier.highlighted ? "default" : "makina"}
              >
                <Link href={tier.href ?? "#descargar"}>
                  {tier.id === "pro" ? <Crown className="h-5 w-5" /> : <Download className="h-5 w-5" />}
                  {tier.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold">Función</th>
                <th className="p-4 text-center font-semibold">Gratis</th>
                <th className="p-4 text-center font-semibold text-makina-gold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["BPM + KEY offline", true, true],
                ["Preset Makina / Hard", true, true],
                ["Estructura DJ completa", false, true],
                ["Historial de análisis", false, true],
                ["Todos los presets de género", false, true],
                ["Panel técnico avanzado", false, true],
              ].map(([label, free, pro]) => (
                <tr key={String(label)} className="border-b border-white/5">
                  <td className="p-4 text-muted-foreground">{label}</td>
                  <td className="p-4 text-center">
                    {free ? (
                      <Check className="mx-auto h-4 w-4 text-makina-cyan" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {pro ? (
                      <Check className="mx-auto h-4 w-4 text-makina-gold" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="descargar" className="scroll-mt-24 border-t border-white/5 bg-makina-mesh py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <Smartphone className="mx-auto h-10 w-10 text-makina-cyan" />
          <h2 className="mt-4 font-display text-3xl font-bold">Descargar en iPhone</h2>
          <p className="mt-3 text-muted-foreground">
            Disponible para iOS 17+. Cuando publiques en App Store, añade la URL en Vercel como{" "}
            <code className="rounded bg-white/5 px-1 text-xs">NEXT_PUBLIC_ANALYZR_APP_STORE_URL</code>.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="makina" className="min-w-[220px] gap-2">
              <Link href={freeTier.href ?? "#"}>
                <Download className="h-5 w-5" />
                App Store — Gratis
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[220px] gap-2 border-makina-gold/40 text-makina-gold"
            >
              <Link href={proTier.href ?? "#pro"}>
                <Crown className="h-5 w-5" />
                Comprar Pro — {proTier.price}
              </Link>
            </Button>
          </div>
          <ul className="mt-10 space-y-2 text-left text-sm text-muted-foreground">
            {ANALYZR_REQUIREMENTS.map((r) => (
              <li key={r} className="flex gap-2">
                <Mic className="mt-0.5 h-4 w-4 shrink-0 text-makina-pink" />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            El audio se procesa solo en tu dispositivo. Makina Hub no recibe grabaciones.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-makina-pink hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de Makina Hub
        </Link>
      </div>
    </>
  );
}
