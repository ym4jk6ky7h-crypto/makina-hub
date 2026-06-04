"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TAB_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isTabActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/buscar") return pathname.startsWith("/buscar");
  return pathname.startsWith(href);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden"
      aria-label="Navegación principal"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
        {MOBILE_TAB_NAV.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 transition-colors",
                active
                  ? "text-makina-pink"
                  : "text-muted-foreground active:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active && "drop-shadow-[0_0_8px_rgba(255,45,106,0.5)]"
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="truncate text-[10px] font-semibold leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
