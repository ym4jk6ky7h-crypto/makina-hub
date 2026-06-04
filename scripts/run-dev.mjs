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
const child = spawn(process.execPath, [nextBin, "dev", "--turbopack"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 0));
