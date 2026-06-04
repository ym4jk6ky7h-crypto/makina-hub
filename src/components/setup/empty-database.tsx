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
          Supabase está conectado, pero no hay artistas ni eventos todavía.
          Ejecuta el seed en el SQL Editor de Supabase.
        </p>
        <ol className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
          <li>1. Supabase → SQL Editor → Run:</li>
          <li className="font-mono text-xs">supabase/reset-datos.sql</li>
          <li>2. Luego Run el archivo completo:</li>
          <li className="font-mono text-xs">supabase/seed.sql</li>
          <li>3. Recarga esta página (F5)</li>
        </ol>
        <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Button variant="outline">Abrir Supabase</Button>
        </Link>
      </div>
    </div>
  );
}
