/**
 * Repara URLs rotas y vuelve a sincronizar imágenes / YouTube.
 *
 * npm run db:fix-media
 */
import { normalizePurchaseUrl } from "../src/lib/normalize-purchase-url";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";
import { spawn } from "child_process";
import * as path from "path";

loadEnv();

const supabase = createAdminClient();
const root = path.join(__dirname, "..");
const tsxBin = path.join(root, "node_modules", ".bin", "tsx");

function runScript(name: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(tsxBin, [path.join(__dirname, name)], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${name} exit ${code}`))
    );
  });
}

async function fixDiscogsPurchaseUrls() {
  const { data, error } = await supabase
    .from("new_releases")
    .select("id, slug, purchase_url");
  if (error) throw error;

  let fixed = 0;
  for (const row of data ?? []) {
    const next = normalizePurchaseUrl(row.purchase_url);
    if (next === row.purchase_url) continue;
    const { error: upErr } = await supabase
      .from("new_releases")
      .update({ purchase_url: next })
      .eq("id", row.id);
    if (!upErr) fixed++;
  }
  console.log(`🔗 Novedades: ${fixed} enlaces Discogs corregidos`);
}

async function main() {
  console.log("\n🔧 Makina Hub — reparar medios\n");
  await fixDiscogsPurchaseUrls();
  console.log("\n👤 Actualizando fotos de artistas…\n");
  await runScript("refresh-artist-images.ts");
  console.log("\n📅 Actualizando carteles de eventos (puede tardar)…\n");
  await runScript("discover-events.ts");
  console.log("\n🎧 Actualizando sesiones YouTube…\n");
  await runScript("discover-sessions.ts");
  console.log("\n🆕 Re-sincronizando novedades…\n");
  await runScript("discover-releases.ts");
  console.log("\n✅ Listo. Recarga la web.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
