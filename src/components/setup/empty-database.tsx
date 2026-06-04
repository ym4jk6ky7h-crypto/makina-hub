import Link from "next/link";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyDatabase() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="glass-card border-makina-gold/30 p-8 text-center">
        <Database className="mx-auto mb-4 h-10 w-10 text-makina-gold" />
        <h2 className="text-xl font-bold">Base de datos vacía</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Supabase está conectado, pero aún no hay artistas ni eventos. Sincroniza
          el catálogo mákina desde tu Mac.
        </p>
        <p className="mt-4 rounded-lg bg-white/5 px-3 py-2 font-mono text-xs text-makina-cyan">
          npm run db:sync-all -- --skip-mb
        </p>
        <ol className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
          <li>1. Supabase → SQL Editor → migraciones 002 y 003</li>
          <li>2. Terminal en la carpeta makina-hub (comando de arriba)</li>
          <li>3. Recarga esta página</li>
        </ol>
        <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Button variant="outline">Abrir Supabase</Button>
        </Link>
      </div>
    </div>
  );
}
