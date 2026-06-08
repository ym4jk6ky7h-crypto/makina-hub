/**
 * Envía el digest semanal a suscriptores activos.
 *
 * npm run db:send-newsletter -- --dry-run
 * npm run db:send-newsletter -- --limit=3
 */
import { buildDigestHtml, buildDigestSubject } from "../src/lib/newsletter/digest";
import { fetchNewsletterDigest, isDigestEmpty } from "../src/lib/newsletter/fetch-digest";
import { sendDigestEmail } from "../src/lib/newsletter/send-digest";
import { listActiveSubscribers } from "../src/lib/newsletter/subscribers";
import { loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

async function main() {
  console.log("\n📬 Makina Hub — digest newsletter\n");

  const digest = await fetchNewsletterDigest();
  if (isDigestEmpty(digest)) {
    console.log("⊘ No hay contenido nuevo para enviar.\n");
    return;
  }

  console.log(buildDigestSubject(digest));
  console.log(`  ${digest.events.length} eventos · ${digest.sessions.length} sesiones · ${digest.releases.length} novedades\n`);

  if (dryRun) {
    const sample = buildDigestHtml(digest, `${digest.siteUrl}/desuscribir?token=ejemplo`);
    console.log(sample.slice(0, 1200), "\n…\n");
    console.log("Modo dry-run: no se envió ningún email.\n");
    return;
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    console.log("❌ Falta RESEND_API_KEY en CLAVES-SUPABASE.env o Vercel.\n");
    console.log("Prueba antes con: npm run db:send-newsletter -- --dry-run\n");
    process.exit(1);
  }

  const subscribers = await listActiveSubscribers(limit);
  if (subscribers.length === 0) {
    console.log("⊘ No hay suscriptores activos.\n");
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    process.stdout.write(`${sub.email}… `);
    const result = await sendDigestEmail(sub.email, digest, sub.unsubscribe_token);
    if (result.ok) {
      console.log("✓");
      sent++;
    } else {
      console.log(`✗ ${result.error ?? "error"}`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n✅ ${sent} enviados · ${failed} fallidos · ${subscribers.length} total\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
