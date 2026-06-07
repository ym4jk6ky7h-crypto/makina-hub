import { CURATED_SESSION_WATCH_BY_SLUG } from "../../src/data/curated-session-youtube";

export function curatedSessionPortrait(slug: string): string | null {
  const watch = CURATED_SESSION_WATCH_BY_SLUG[`${slug}-sesion-makina`];
  if (!watch) return null;
  const m = watch.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : null;
}
