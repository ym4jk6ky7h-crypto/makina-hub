import { ensureEnvLoaded } from "./load-env";

const PLACEHOLDER_PATTERNS = [
  "YOUR_PROJECT",
  "your-anon-key",
  "your-service-role-key",
  "your-project.supabase.co",
  "Pega-aqui",
  "pega-aqui",
];

export function isSupabaseConfigured(): boolean {
  ensureEnvLoaded();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  const combined = `${url} ${key}`;
  return !PLACEHOLDER_PATTERNS.some((p) => combined.includes(p));
}

export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new SupabaseConfigError(
      "Supabase no está configurado. En makina-hub/CLAVES-SUPABASE.env (o .env.local) añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o ANON_KEY). Reinicia con npm run dev."
    );
  }
}

export function formatSupabaseError(error: unknown): string {
  if (error instanceof SupabaseConfigError) return error.message;

  if (error && typeof error === "object" && "message" in error) {
    const e = error as { message?: string; code?: string; details?: string };
    const msg = e.message ?? "Error desconocido";

    if (msg.includes("fetch failed") || msg.includes("ENOTFOUND")) {
      return "No se puede conectar a Supabase. Revisa NEXT_PUBLIC_SUPABASE_URL en .env.local (debe ser https://xxxxx.supabase.co).";
    }
    if (e.code === "42P01" || msg.includes("does not exist")) {
      return "Las tablas no existen. Ejecuta supabase/migrations/002_makina_hub_production.sql y luego supabase/seed.sql en el SQL Editor de Supabase.";
    }
    if (e.code === "PGRST205" || msg.includes("Could not find")) {
      if (msg.includes("new_releases")) {
        return "Falta la tabla new_releases. Ejecuta supabase/migrations/003_new_releases.sql en el SQL Editor de Supabase y luego npm run db:discover-releases.";
      }
      return "Tabla no encontrada en Supabase. Ejecuta la migración 002_makina_hub_production.sql.";
    }
    return msg;
  }

  if (error instanceof Error) return error.message;
  return "Error al conectar con Supabase.";
}
