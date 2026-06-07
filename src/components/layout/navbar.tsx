"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MakinaLogo } from "@/components/layout/makina-logo";
import { NAV_ITEMS } from "@/lib/constants";
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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = NAV_ITEMS.filter((i) => i.href !== "/");

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/85 backdrop-blur-xl">
      <div className="h-0.5 w-full bg-gradient-to-r from-makina-pink via-makina-purple to-makina-cyan opacity-80" />
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-3 lg:px-5">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
          <MakinaLogo size="sm" />
        </Link>

        <div className="hidden min-w-0 flex-1 md:block md:max-w-sm lg:max-w-md xl:max-w-lg">
          <SearchBar compact placeholder="Buscar DJ, evento…" />
        </div>

        <nav className="ml-auto hidden min-w-0 items-center gap-0.5 lg:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all 2xl:px-2.5 2xl:text-sm",
                  active
                    ? "bg-makina-pink/10 text-foreground shadow-makina-glow-sm"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  item.highlight && !active && "text-makina-cyan"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 shrink-0", active && "text-makina-pink")} />
                {item.label}
              </Link>
            );
          })}
          <Link href="/buscar" className="ml-0.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2 text-xs 2xl:text-sm",
                isActive(pathname, "/buscar") && "bg-white/5 text-foreground"
              )}
            >
              Buscar
            </Button>
          </Link>
        </nav>

        <Link href="/ask" className="hidden shrink-0 sm:block lg:hidden">
          <Button size="sm" variant="outline" className="gap-1 border-makina-cyan/30">
            <Sparkles className="h-3.5 w-3.5 text-makina-cyan" />
            AI
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-background/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="mb-4">
            <SearchBar placeholder="Buscar DJ, evento…" />
          </div>
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
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
        </div>
      )}
    </header>
  );
}
