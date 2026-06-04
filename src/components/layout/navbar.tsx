"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { MakinaLogo } from "@/components/layout/makina-logo";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainNav = NAV_ITEMS.filter((item) => item.href !== "/" && item.href !== "/ask");

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/85 backdrop-blur-xl">
      <div className="h-0.5 w-full bg-gradient-to-r from-makina-pink via-makina-purple to-makina-cyan opacity-80" />
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
          <MakinaLogo size="sm" />
        </Link>

        <div className="hidden flex-1 md:block md:max-w-md lg:max-w-lg xl:max-w-xl">
          <SearchBar compact placeholder="Buscar DJ, tema, evento…" />
        </div>

        <nav className="ml-auto hidden items-center gap-0.5 xl:flex">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-makina-pink/10 text-foreground shadow-makina-glow-sm"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-makina-pink")} />
                {item.label}
              </Link>
            );
          })}
          <Link href="/ask">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "ml-2 gap-1.5 border-makina-cyan/40 bg-makina-cyan/5",
                isActive(pathname, "/ask") && "border-makina-cyan shadow-makina-glow-sm"
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-makina-cyan" />
              AI
            </Button>
          </Link>
        </nav>

        <Link href="/ask" className="hidden sm:block xl:hidden">
          <Button size="sm" variant="outline" className="gap-1 border-makina-cyan/30">
            <Sparkles className="h-3.5 w-3.5 text-makina-cyan" />
            AI
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Más secciones"
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-background/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="mb-4">
            <SearchBar placeholder="Buscar DJ, tema, evento…" />
          </div>
          {(["escena", "catalogo", "tools"] as const).map((group) => (
            <div key={group} className="mb-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-makina-pink/80">
                {NAV_GROUPS[group]}
              </p>
              <nav className="flex flex-col gap-0.5">
                {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                        active ? "nav-glow-active" : "text-muted-foreground hover:bg-white/5",
                        item.highlight && !active && "text-makina-cyan"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
