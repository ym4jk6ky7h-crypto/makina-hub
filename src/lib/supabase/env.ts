import { ensureEnvLoaded } from "./load-env";

export function getSupabaseApiKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getSupabaseEnv() {
  ensureEnvLoaded();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = getSupabaseApiKey();

  if (!url || !anonKey) {
    throw new Error(
      "Supabase no configurado. En CLAVES-SUPABASE.env añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (o PUBLISHABLE_KEY)."
    );
  }

  return { url, anonKey };
}

export function getSupabaseEnvClient() {
  return getSupabaseEnv();
}
