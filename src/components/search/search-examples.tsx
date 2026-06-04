import Link from "next/link";
import { SEARCH_EXAMPLES } from "@/lib/constants";

export function SearchExamples() {
  return (
    <div className="mt-6">
      <p className="text-sm text-muted-foreground">Prueba con:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SEARCH_EXAMPLES.map((ex) => (
          <Link
            key={ex.q}
            href={`/buscar?q=${encodeURIComponent(ex.q)}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-makina-pink/30 hover:bg-makina-pink/10"
          >
            {ex.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
