/**
 * Comprueba la tabla newsletter_subscribers y muestra SQL si falta algo.
 * npm run db:setup-newsletter
 */
import fs from "fs";
import path from "path";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

function printSql(title: string, filename: string) {
  const sqlPath = path.join(__dirname, "../supabase/migrations", filename);
  const sql = fs.readFileSync(sqlPath, "utf8");
  console.log(`
❌ ${title}

IMPORTANTE: no pegues la ruta del archivo en el SQL Editor.
Copia SOLO el SQL de abajo:

────────── copiar desde aquí ──────────
${sql.trim()}
────────── hasta aquí ──────────

Supabase Dashboard → SQL Editor → New query → pegar → Run
`);
}

async function main() {
  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").select("id").limit(1);

  if (error?.message.includes("newsletter_subscribers")) {
    printSql("Falta la tabla newsletter_subscribers.", "004_newsletter_subscribers.sql");
    process.exit(1);
  }

  if (error) {
    console.error("\n❌ Error:", error.message, "\n");
    process.exit(1);
  }

  const { error: tokenError } = await supabase
    .from("newsletter_subscribers")
    .select("unsubscribe_token")
    .limit(1);

  if (tokenError?.message.includes("unsubscribe_token")) {
    printSql(
      "Falta la columna unsubscribe_token (migración 007).",
      "007_newsletter_unsubscribe_token.sql"
    );
    process.exit(1);
  }

  if (tokenError) {
    console.error("\n❌ Error:", tokenError.message, "\n");
    process.exit(1);
  }

  console.log("\n✅ Newsletter listo (tabla + tokens de desuscripción).\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
