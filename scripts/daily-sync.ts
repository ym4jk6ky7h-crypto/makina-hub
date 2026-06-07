/**
 * Sincronización diaria: eventos, novedades y sesiones YouTube.
 *
 * npm run db:daily-sync
 * npm run db:daily-sync -- --quick   (fetch Discogs reducido; sesiones siempre se actualizan)
 *
 * En producción: Vercel Cron → /api/cron/daily-sync (6:00 UTC)
 */
import { spawn } from "child_process";
import * as path from "path";

const root = path.join(__dirname, "..");
const tsxBin = path.join(root, "node_modules", ".bin", "tsx");
const quick = process.argv.includes("--quick");

function run(script: string, extraArgs: string[] = []) {
  return new Promise<void>((resolve, reject) => {
    const scriptPath = path.join(__dirname, script);
    const args = [scriptPath, ...extraArgs, ...(quick ? ["--quick"] : [])];
    const child = spawn(tsxBin, args, { cwd: root, stdio: "inherit", shell: false });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} exit ${code}`))
    );
  });
}

async function main() {
  console.log("\n🔄 Makina Hub — sincronización diaria\n");
  const started = Date.now();

  await run("fetch-auto.ts");
  await run("discover-events.ts");
  await run("discover-releases.ts");
  await run("discover-sessions.ts", ["--recent-days=14", "--max=80"]);

  const sec = Math.round((Date.now() - started) / 1000);
  console.log(`\n✨ Daily sync OK (${sec}s). Recarga /novedades y /sesiones\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
