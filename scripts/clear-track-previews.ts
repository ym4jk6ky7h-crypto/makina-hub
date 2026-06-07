/**
 * Elimina previews iTunes de la BD (solo temas completos en la app).
 * npm run db:clear-track-previews
 */
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

async function main() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("tracks")
    .update({
      preview_url: null,
      source_type: null,
    })
    .not("preview_url", "is", null)
    .select("slug");

  if (error) throw error;

  console.log(`\n✅ Previews iTunes eliminados en ${data?.length ?? 0} temas.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
