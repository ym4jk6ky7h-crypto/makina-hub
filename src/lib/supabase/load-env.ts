import { config } from "dotenv";
import fs from "fs";
import path from "path";

let loaded = false;

/** Carga CLAVES-SUPABASE.env + .env.local en dev (Next a veces pierde vars tras hot reload). */
export function ensureEnvLoaded(): void {
  if (loaded) return;
  const root = process.cwd();
  const local = path.join(root, ".env.local");
  const keys = path.join(root, "CLAVES-SUPABASE.env");
  if (fs.existsSync(local)) config({ path: local, override: true });
  if (fs.existsSync(keys)) config({ path: keys, override: true });
  loaded = true;
}
