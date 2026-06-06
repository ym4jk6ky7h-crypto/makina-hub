/**
 * Comprueba la tabla newsletter_subscribers y muestra SQL si falta.
 * npm run db:setup-newsletter
 */
import fs from "fs";
import path from "path";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

async function main() {
  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").select("id").limit(1);

  if (!error) {
    console.log("\n✅ Tabla newsletter_subscribers lista.\n");
    return;
  }

  if (!error.message.includes("newsletter_subscribers")) {
    console.error("\n❌ Error:", error.message, "\n");
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, "../supabase/migrations/004_newsletter_subscribers.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log(`
❌ Falta la tabla newsletter_subscribers.

IMPORTANTE: no pegues la ruta del archivo en el SQL Editor.
Copia SOLO el SQL de abajo (desde CREATE TABLE hasta el final):

────────── copiar desde aquí ──────────
${sql.trim()}
────────── hasta aquí ──────────

Supabase Dashboard → SQL Editor → New query → pegar → Run
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
