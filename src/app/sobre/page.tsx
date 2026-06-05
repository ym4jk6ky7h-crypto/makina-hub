import Link from "next/link";
import {
  Calendar,
  Database,
  ExternalLink,
  Headphones,
  Music2,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeader } from "@/components/layout/section-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { EXTERNAL_LINKS } from "@/lib/site-links";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = buildMetadata({
  title: "Cómo funciona",
  description:
    "De dónde salen los datos de Makina Hub: artistas, eventos, sesiones, novedades y enlaces externos.",
  path: "/sobre",
});

type SourceItem = {
  icon: typeof Database;
  title: string;
  body: string;
  link?: { href: string; label: string; external?: boolean };
};

const DATA_SOURCES: SourceItem[] = [
  {
    icon: Database,
    title: "Supabase",
    body: "Base de datos central con artistas, temas, eventos, sesiones, sellos y novedades. La web lee en tiempo real vía API.",
  },
  {
    icon: Calendar,
    title: "Eventos",
    body: "Agenda curada en catálogo propio, fusionada con eventos publicados en Makina Legends y otras fuentes. Se sincroniza con scripts diarios.",
    link: {
      href: EXTERNAL_LINKS.makinaLegendsEvents,
      label: "makinalegends.com/eventos",
      external: true,
    },
  },
  {
    icon: Headphones,
    title: "Sesiones",
    body: "Vídeos de YouTube de al menos 15 minutos por DJ. Se priorizan sesiones recientes y se validan antes de publicar.",
    link: { href: EXTERNAL_LINKS.youtube, label: "YouTube", external: true },
  },
  {
    icon: Music2,
    title: "Música y novedades",
    body: "Temas clásicos curados manualmente; novedades con portadas y enlaces de compra desde Discogs cuando hay token configurado.",
    link: { href: EXTERNAL_LINKS.discogs, label: "Discogs", external: true },
  },
  {
    icon: RefreshCw,
    title: "Sincronización",
    body: "Desde tu Mac: npm run db:daily-sync o db:fix-media. En producción puede ejecutarse un cron diario para mantener eventos y medios al día.",
  },
  {
    icon: Sparkles,
    title: "Ask Makina AI",
    body: "Preguntas en lenguaje natural sobre la escena. Usa el mismo catálogo de la web; no inventa datos fuera de la base.",
    link: { href: "/ask", label: "Probar Ask Makina" },
  },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        title="Cómo funciona Makina Hub"
        subtitle="Transparencia sobre el origen de los datos, los enlaces externos y cómo mantener el catálogo actualizado."
        image={SITE_IMAGES.heroEvents}
        badge="Confianza"
      />

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <section className="mb-12">
          <SectionHeader title="Qué es" />
          <p className="leading-relaxed text-muted-foreground">
            Makina Hub es la enciclopedia de la mákina catalana: artistas, agenda de fiestas,
            canciones, sesiones en vídeo y nuevas producciones con enlace de compra. No gestionamos
            entradas ni pagos; te llevamos a las fuentes oficiales cuando hace falta.
          </p>
        </section>

        <section className="mb-12">
          <SectionHeader title="Fuentes de datos" />
          <ul className="space-y-4">
            {DATA_SOURCES.map((item) => (
              <li key={item.title} className="glass-card p-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-makina-pink/15">
                    <item.icon className="h-5 w-5 text-makina-pink" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                    {item.link &&
                      (item.link.external ? (
                        <a
                          href={item.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-makina-cyan hover:underline"
                        >
                          {item.link.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={item.link.href}
                          className="mt-2 inline-block text-sm font-medium text-makina-cyan hover:underline"
                        >
                          {item.link.label}
                        </Link>
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <SectionHeader title="Enlaces de la escena" />
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={EXTERNAL_LINKS.makinaLegends}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-makina-pink hover:underline"
              >
                Makina Legends — entradas y eventos oficiales
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
            <li>
              <Link href="/eventos" className="text-foreground hover:text-makina-pink hover:underline">
                Agenda en Makina Hub
              </Link>
            </li>
            <li>
              <Link href="/buscar" className="text-foreground hover:text-makina-pink hover:underline">
                Buscar en todo el catálogo
              </Link>
            </li>
          </ul>
        </section>

        <section className="glass-card border-makina-cyan/20 p-6">
          <div className="flex gap-3">
            <Shield className="h-6 w-6 shrink-0 text-makina-cyan" aria-hidden />
            <div>
              <h3 className="font-semibold">Privacidad y enlaces externos</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Al abrir YouTube, Discogs, Makina Legends u otras tiendas sales de Makina Hub. Los
                reproductores de audio y vídeo cargan contenido de terceros bajo sus propias
                condiciones. Si detectas un enlace roto o un dato incorrecto, puedes corregirlo en
                Supabase o volver a ejecutar los scripts de sincronización.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
