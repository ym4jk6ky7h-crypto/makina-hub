import { Mail } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

export function HomeNewsletter() {
  return (
    <section className="border-t border-white/5 bg-makina-mesh py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-makina-pink">
            <Mail className="h-4 w-4" />
            Newsletter
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            Lo nuevo de la escena, en tu bandeja
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Remember del fin de semana, sesiones recién subidas a YouTube y novedades del
            catálogo. Un email ocasional, sin spam.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
          <NewsletterSignup source="home" />
        </div>
      </div>
    </section>
  );
}
