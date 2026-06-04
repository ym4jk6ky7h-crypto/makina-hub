import Link from "next/link";
import { Database, FileCode, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type SetupRequiredProps = {
  message: string;
};

export function SetupRequired({ message }: SetupRequiredProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24">
      <div className="glass-card border-makina-pink/20 p-8">
        <Database className="mb-4 h-10 w-10 text-makina-pink" />
        <h1 className="text-2xl font-bold">Configura Supabase</h1>
        <p className="mt-3 text-muted-foreground">{message}</p>

        <ol className="mt-8 space-y-6 text-sm">
          <li className="flex gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-makina-cyan" />
            <div>
              <p className="font-medium">1. Edita CLAVES-SUPABASE.env</p>
              <p className="mt-1 text-muted-foreground">
                En Cursor, carpeta <strong>makina-hub</strong>, abre el archivo{" "}
                <strong>CLAVES-SUPABASE.env</strong> (sí es visible). En{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-makina-pink hover:underline"
                >
                  Supabase
                </a>
                {" "}→ Connect → Framework → Next.js → copia URL y clave anon.
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-secondary p-3 text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...`}
              </pre>
            </div>
          </li>
          <li className="flex gap-3">
            <FileCode className="mt-0.5 h-5 w-5 shrink-0 text-makina-cyan" />
            <div>
              <p className="font-medium">2. Crear tablas (SQL Editor)</p>
              <p className="mt-1 text-muted-foreground">
                Ejecuta{" "}
                <code className="text-xs">002_makina_hub_production.sql</code>, luego{" "}
                <code className="text-xs">003_new_releases.sql</code> (novedades), y en la
                terminal del proyecto:{" "}
                <code className="text-xs">npm run db:sync-all -- --skip-mb</code>
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Database className="mt-0.5 h-5 w-5 shrink-0 text-makina-cyan" />
            <div>
              <p className="font-medium">3. Reiniciar el servidor</p>
              <p className="mt-1 text-muted-foreground">
                Para en la terminal con Ctrl+C y ejecuta de nuevo:
              </p>
              <pre className="mt-2 rounded-lg bg-secondary p-3 text-xs">npm run dev</pre>
            </div>
          </li>
        </ol>

        <div className="mt-8">
          <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
            <Button>Abrir Supabase Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
