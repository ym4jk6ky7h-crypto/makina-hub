import Image from "next/image";
import Link from "next/link";
import { Calendar, Mic2, Music2 } from "lucide-react";
import { MakinaLogo } from "@/components/layout/makina-logo";
import { NAV_ITEMS, SITE_TAGLINE } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";

export function Footer() {
  const explore = NAV_ITEMS.filter((i) => i.group !== "tools");
  const catalog = NAV_ITEMS.filter((i) => i.group === "catalogo");

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
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
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <MakinaLogo size="md" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {SITE_TAGLINE}. Artistas, eventos remember, sesiones históricas,
              sellos discográficos y vinilos de la cultura mákina en Catalunya.
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
                    className="text-sm text-muted-foreground transition-colors hover:text-makina-pink"
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
                    className="text-sm text-muted-foreground transition-colors hover:text-makina-cyan"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/artistas"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-makina-pink hover:underline"
            >
              <Mic2 className="h-4 w-4" />
              Artistas de la escena
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Makina Hub — Música mákina & remember
          </p>
          <p className="text-xs text-muted-foreground">
            Next.js · Supabase · Hecho en Catalunya
          </p>
        </div>
      </div>
    </footer>
  );
}
