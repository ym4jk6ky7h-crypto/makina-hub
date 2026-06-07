/**
 * Fusiona duplicados, restaura nombres del roster y aplica fotos de sesión YouTube curadas.
 *
 * npm run db:fix-artists
 */
import { MAKINA_ARTISTS } from "../data/makina-artists";
import { curatedSessionPortrait } from "./lib/artist-portrait";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const MERGE_INTO: Record<string, string> = {
  requena: "gerard-requena",
  "marc-escudero": "skudero",
  "toni-costa": "konik",
};

const supabase = createAdminClient();

async function mergeArtist(fromSlug: string, toSlug: string): Promise<void> {
  const { data: from } = await supabase.from("artists").select("id").eq("slug", fromSlug).maybeSingle();
  const { data: to } = await supabase.from("artists").select("id").eq("slug", toSlug).maybeSingle();
  if (!from || !to) {
    console.log(`⊘ merge ${fromSlug} → ${toSlug}: falta artista en BD`);
    return;
  }
  if (from.id === to.id) return;

  for (const table of ["sessions", "tracks", "new_releases"] as const) {
    const { error } = await supabase.from(table).update({ artist_id: to.id }).eq("artist_id", from.id);
    if (error) console.log(`  ✗ ${table}: ${error.message}`);
  }

  const { data: links } = await supabase
    .from("event_artists")
    .select("event_id")
    .eq("artist_id", from.id);

  for (const link of links ?? []) {
    await supabase.from("event_artists").upsert(
      { event_id: link.event_id, artist_id: to.id },
      { onConflict: "event_id,artist_id", ignoreDuplicates: true }
    );
  }
  await supabase.from("event_artists").delete().eq("artist_id", from.id);

  const { error: delErr } = await supabase.from("artists").delete().eq("id", from.id);
  console.log(
    delErr ? `✗ no se pudo borrar ${fromSlug}: ${delErr.message}` : `🔀 ${fromSlug} → ${toSlug}`
  );
}

async function main() {
  console.log("\n🎧 Makina Hub — corrección de artistas\n");

  for (const [from, to] of Object.entries(MERGE_INTO)) {
    await mergeArtist(from, to);
  }

  let fixed = 0;
  for (const seed of MAKINA_ARTISTS) {
    const portrait = curatedSessionPortrait(seed.slug);
    const { error } = await supabase
      .from("artists")
      .update({
        name: seed.name,
        ...(portrait ? { image_url: portrait } : {}),
      })
      .eq("slug", seed.slug);

    if (error) console.log(`✗ ${seed.slug}: ${error.message}`);
    else {
      console.log(`✓ ${seed.name}${portrait ? " + foto sesión" : ""}`);
      fixed++;
    }
  }

  const validSlugs = new Set(MAKINA_ARTISTS.map((a) => a.slug));
  const preserveSlugs = new Set(["sesiones-makina-varios"]);
  const { data: existing } = await supabase.from("artists").select("id, slug, name");
  const stale = (existing ?? []).filter(
    (a) => !validSlugs.has(a.slug) && !preserveSlugs.has(a.slug)
  );
  for (const row of stale) {
    await supabase.from("artists").delete().eq("id", row.id);
    console.log(`🗑 ${row.name} (${row.slug})`);
  }

  console.log(`\n✅ ${fixed} artistas corregidos · roster ${MAKINA_ARTISTS.length}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
