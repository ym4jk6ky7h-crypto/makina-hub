/**
 * Pipeline: artistas → sellos → eventos → temas (mákina catalana)
 * npm run db:sync-all
 * npm run db:sync-all -- --limit=10 --skip-mb
 */
import { spawn } from "child_process";
import * as path from "path";

const root = path.join(__dirname, "..");
const tsxBin = path.join(root, "node_modules", ".bin", "tsx");

/** Flags tras `--` en npm (p. ej. --skip-mb, --limit=10, --dry-run) */
const passthrough = process.argv.slice(2);

function run(script: string, extraArgs: string[] = []) {
  return new Promise<void>((resolve, reject) => {
    const scriptPath = path.join(__dirname, script);
    const child = spawn(tsxBin, [scriptPath, ...extraArgs, ...passthrough], {
      cwd: root,
      stdio: "inherit",
      shell: false,
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} exit ${code}`))
    );
  });
}

async function main() {
  console.log("\n🚀 Makina Hub — sync completo\n");
  await run("discover-artists.ts");
  await run("discover-labels.ts");
  await run("discover-events.ts");
  await run("discover-sessions.ts");
  await run("discover-tracks.ts");
  await run("discover-releases.ts");
  console.log("\n✨ Sync terminado. Recarga http://localhost:3000\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
