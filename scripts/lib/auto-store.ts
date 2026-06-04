import fs from "fs";
import path from "path";

const AUTO_DIR = path.join(__dirname, "../../data/auto");

export type AutoSyncMeta = {
  lastRun: string;
  events: number;
  releases: number;
  tracks: number;
  errors: string[];
};

export function ensureAutoDir() {
  if (!fs.existsSync(AUTO_DIR)) fs.mkdirSync(AUTO_DIR, { recursive: true });
}

export function readJson<T>(filename: string, fallback: T): T {
  ensureAutoDir();
  const p = path.join(AUTO_DIR, filename);
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(filename: string, data: unknown) {
  ensureAutoDir();
  fs.writeFileSync(path.join(AUTO_DIR, filename), JSON.stringify(data, null, 2), "utf8");
}

export function readAutoMeta(): AutoSyncMeta {
  return readJson<AutoSyncMeta>("sync-meta.json", {
    lastRun: "",
    events: 0,
    releases: 0,
    tracks: 0,
    errors: [],
  });
}

export function writeAutoMeta(meta: AutoSyncMeta) {
  writeJson("sync-meta.json", meta);
}
