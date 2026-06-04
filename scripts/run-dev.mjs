import { config } from "dotenv";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const keysFile = path.join(root, "CLAVES-SUPABASE.env");
const localFile = path.join(root, ".env.local");

if (fs.existsSync(localFile)) {
  config({ path: localFile });
}
if (fs.existsSync(keysFile)) {
  config({ path: keysFile, override: true });
}

const nextBin = path.join(root, "node_modules", ".bin", "next");
const child = spawn(process.execPath, [nextBin, "dev", "--turbopack", "-p", "3000"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  shell: false,
});

child.on("exit", (code) => {
  if (code === 1) {
    console.log(
      "\n⚠️  El puerto 3000 está ocupado. Cierra el otro servidor (Ctrl+C en esa terminal)\n" +
        "   o ejecuta: lsof -ti :3000 | xargs kill -9\n" +
        "   Luego vuelve a: npm run dev\n"
    );
  }
  process.exit(code ?? 0);
});
