import * as dotenv from "dotenv";
import * as path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function loadEnv() {
  dotenv.config({ path: path.join(__dirname, "../../.env.local") });
  dotenv.config({ path: path.join(__dirname, "../../CLAVES-SUPABASE.env"), override: true });
}

export function createAdminClient(): SupabaseClient {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.error(`
❌ Falta clave secreta de Supabase para escribir en la BD.

En Supabase Dashboard → Settings → API Keys:
  • Pestaña "API Keys" → Secret key (sb_secret_...)
  • O pestaña "Legacy API Keys" → service_role (empieza por eyJ...)

Añádela en CLAVES-SUPABASE.env (una de las dos):

   SUPABASE_SECRET_KEY=sb_secret_...
   # o
   SUPABASE_SERVICE_ROLE_KEY=eyJ...

Guarda el archivo (Cmd+S) y vuelve a ejecutar el comando.
`);
    process.exit(1);
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
