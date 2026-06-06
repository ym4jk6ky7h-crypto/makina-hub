import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEARCH_EXAMPLES } from "@/lib/constants";

export function HomeQuickDiscover() {
  return (
    <section className="border-b border-white/5 py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-makina-cyan">
              <Sparkles className="h-4 w-4" />
              Descubre
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Accesos rápidos a lo más buscado en la escena
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SEARCH_EXAMPLES.map(({ label, q }) => (
              <Button key={q} variant="outline" size="sm" className="border-white/10" asChild>
                <Link href={`/buscar?q=${encodeURIComponent(q)}`}>{label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
