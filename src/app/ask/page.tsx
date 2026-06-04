import { Sparkles } from "lucide-react";
import { AskMakinaForm } from "@/components/ask/ask-makina-form";
import { PageHero } from "@/components/layout/page-hero";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = buildMetadata({
  title: "Ask Makina AI",
  description:
    "Pregunta en lenguaje natural sobre temas, DJs, eventos y sesiones de la escena mákina.",
  path: "/ask",
});

export default function AskPage() {
  return (
    <>
      <PageHero
        title="Ask Makina AI"
        subtitle="Pregunta en lenguaje natural sobre DJs, temas, eventos y la escena mákina."
        image={SITE_IMAGES.heroAsk}
        badge="Inteligencia artificial"
      />
      <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-makina-cyan/30 bg-makina-cyan/10 px-4 py-1.5 text-xs font-medium text-makina-cyan">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by OpenAI
          </div>
        </div>
        <AskMakinaForm />
      </div>
    </>
  );
}
