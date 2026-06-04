"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MakinaLogo } from "@/components/layout/makina-logo";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-white/5 bg-card/30 lg:block xl:w-64">
      <nav className="sticky top-[4.125rem] flex max-h-[calc(100vh-4.125rem)] flex-col gap-6 overflow-y-auto p-4">
        {(["escena", "catalogo", "tools"] as const).map((group) => (
          <div key={group}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {NAV_GROUPS[group]}
            </p>
            <div className="flex flex-col gap-0.5">
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "nav-glow-active shadow-makina-glow-sm"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                      item.highlight && !active && "text-makina-cyan hover:text-makina-cyan"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-makina-pink" : "group-hover:text-makina-pink/70"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          href="/eventos"
          className="group relative mt-2 overflow-hidden rounded-xl border border-white/10"
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={SITE_IMAGES.sidebarPromo}
              alt="Festival mákina"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="256px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-makina-pink/10 mix-blend-overlay" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-makina-pink">
              Remember 2026
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-tight text-white">
              Próximos eventos en Catalunya
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-makina-cyan">
              Ver cartel
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        <div className="rounded-xl border border-white/5 bg-makina-mesh p-3">
          <MakinaLogo size="sm" showText={false} />
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Pont Aeri · Chasis · Xque · Bit Music — toda la escena mákina catalana en un solo sitio.
          </p>
        </div>
      </nav>
    </aside>
  );
}
