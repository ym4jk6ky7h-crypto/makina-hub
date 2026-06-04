/**
 * Enriquece bios y producciones con OpenAI (ChatGPT). Guarda caché en data/ai-artist-cache.json
 *
 * Requiere OPENAI_API_KEY en CLAVES-SUPABASE.env
 *
 * npm run db:enrich-ai
 * npm run db:enrich-ai -- --limit=5
 * npm run db:enrich-ai -- --slug=skudero
 */
import fs from "fs";
import path from "path";
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { enrichArtistWithOpenAI, type AiArtistEnrichment } from "./lib/openai-artist";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const CACHE_PATH = path.join(__dirname, "../data/ai-artist-cache.json");
const apiKey = process.env.OPENAI_API_KEY;

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : MAKINA_ARTISTS.length;
const onlySlug = slugArg?.split("=")[1];

function loadCache(): Record<string, AiArtistEnrichment> {
  if (!fs.existsSync(CACHE_PATH)) return {};
  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as Record<string, AiArtistEnrichment>;
}

function saveCache(cache: Record<string, AiArtistEnrichment>) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

async function main() {
  if (!apiKey) {
    console.error("\n❌ Falta OPENAI_API_KEY en CLAVES-SUPABASE.env\n");
    console.log("Añade: OPENAI_API_KEY=sk-...\n");
    process.exit(1);
  }

  const targets = MAKINA_ARTISTS.filter((a) => !onlySlug || a.slug === onlySlug).slice(
    0,
    limit
  );
  const cache = loadCache();
  const supabase = createAdminClient();

  console.log(`\n🤖 OpenAI — enriqueciendo ${targets.length} artistas\n`);

  for (let i = 0; i < targets.length; i++) {
    const seed = targets[i];
    process.stdout.write(`[${i + 1}/${targets.length}] ${seed.name}… `);

    try {
      const enriched = await enrichArtistWithOpenAI(seed, apiKey);
      cache[seed.slug] = enriched;
      saveCache(cache);

      const { data: artist } = await supabase
        .from("artists")
        .select("id, biography")
        .eq("slug", seed.slug)
        .maybeSingle();

      if (artist) {
        const bioParts = [
          `**Orígenes.** ${enriched.extendedOrigins}`,
          enriched.style ? `**Estilo.** ${enriched.style}` : "",
          `**Época dorada.** ${enriched.extendedPeak}`,
          enriched.productions.length
            ? `**Producciones y clásicos.** Entre sus temas más conocidos figuran ${enriched.productions.join(", ")}.`
            : "",
          `**Actualidad.** ${enriched.extendedToday}`,
          enriched.legacy ? `**Legado.** ${enriched.legacy}` : "",
        ].filter(Boolean);

        await supabase
          .from("artists")
          .update({
            biography: bioParts.join("\n\n").slice(0, 8000),
            real_name: enriched.realName ?? undefined,
            instagram_url: enriched.instagramUrl,
          })
          .eq("id", artist.id);
      }

      console.log("✓");
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.log(`✗ ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\n✅ Caché guardada en data/ai-artist-cache.json\n`);
  console.log("Ejecuta: npm run db:discover-artists -- --skip-mb\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
