"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MakinaLogo } from "@/components/layout/makina-logo";
import { NAV_MORE, NAV_PRIMARY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function isMoreActive(pathname: string) {
  return NAV_MORE.some((item) => isActive(pathname, item.href));
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [moreOpen]);

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

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAV_PRIMARY.map((item) => {
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

          <div className="relative" ref={moreRef}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1 text-sm font-medium",
                (moreOpen || isMoreActive(pathname)) &&
                  "bg-makina-pink/10 text-foreground"
              )}
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              Más
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")}
              />
            </Button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-white/10 bg-background/95 py-2 shadow-xl backdrop-blur-xl">
                {NAV_MORE.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-makina-pink/10 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                        item.highlight && !active && "text-makina-cyan"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/buscar" className="ml-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                isActive(pathname, "/buscar") && "bg-white/5 text-foreground"
              )}
            >
              Buscar
            </Button>
          </Link>
        </nav>

        <Link href="/ask" className="hidden sm:block lg:hidden">
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

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-makina-pink/80">
            Principal
          </p>
          <nav className="mb-4 flex flex-col gap-0.5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                pathname === "/"
                  ? "nav-glow-active"
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              Inicio
            </Link>
            {NAV_PRIMARY.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "nav-glow-active" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/buscar"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                isActive(pathname, "/buscar")
                  ? "nav-glow-active"
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              Buscar
            </Link>
          </nav>

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Más
          </p>
          <nav className="flex flex-col gap-0.5">
            {NAV_MORE.map((item) => {
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
      )}
    </header>
  );
}
