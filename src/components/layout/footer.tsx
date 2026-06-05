import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  Heart,
  Info,
  Mic2,
  Music2,
  Sparkles,
} from "lucide-react";
import { MakinaLogo } from "@/components/layout/makina-logo";
import { NAV_ITEMS, SITE_TAGLINE } from "@/lib/constants";
import { EXTERNAL_LINKS } from "@/lib/site-links";
import { SITE_IMAGES } from "@/lib/site-images";

export function Footer() {
  const explore = NAV_ITEMS.filter((i) => i.group !== "tools");
  const catalog = NAV_ITEMS.filter((i) => i.group === "catalogo");

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 pb-20 lg:pb-0">
      <div className="absolute inset-0">
        <Image
          src={SITE_IMAGES.footerCrowd}
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
      </div>
      <div className="section-glow-line relative" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <MakinaLogo size="md" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {SITE_TAGLINE}. Artistas, eventos remember, sesiones históricas,
              sellos discográficos y la cultura mákina en Catalunya.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Remember", "Mákina", "Hardcore", "Revival"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-makina-pink" />
              Escena
            </p>
            <ul className="mt-4 space-y-2.5">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-makina-pink focus-visible:rounded-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Music2 className="h-4 w-4 text-makina-cyan" />
              Catálogo
            </p>
            <ul className="mt-4 space-y-2.5">
              {catalog.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-makina-cyan focus-visible:rounded-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Info className="h-4 w-4 text-makina-purple" />
              Proyecto
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/favoritos"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-makina-pink focus-visible:rounded-sm"
                >
                  <Heart className="h-3.5 w-3.5" />
                  Mis favoritos
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/ask"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-makina-cyan focus-visible:rounded-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ask Makina AI
                </Link>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.makinaLegends}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-makina-pink focus-visible:rounded-sm"
                >
                  Makina Legends
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </li>
              <li>
                <Link
                  href="/artistas"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-makina-pink hover:underline focus-visible:rounded-sm"
                >
                  <Mic2 className="h-3.5 w-3.5" />
                  Artistas
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Makina Hub — Música mákina & remember en Catalunya
          </p>
          <p className="text-center text-xs text-muted-foreground sm:text-right">
            <Link href="/sobre" className="hover:text-foreground hover:underline">
              Datos y fuentes
            </Link>
            {" · "}
            Next.js · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
