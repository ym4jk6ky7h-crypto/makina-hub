/**
 * Sincroniza eventos reales/recurrentes de la escena catalana en Supabase.
 *
 * npm run db:discover-events
 * npm run db:discover-events -- --dry-run
 */
import { getMergedEventCatalog } from "../data/merge-events";
import { todayEventDateISO } from "../data/catalan-makina-events";
import { isAllowedImageUrl } from "../src/lib/images/safe-image-url";
import { fetchOgImage } from "./lib/social-image";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const supabase = createAdminClient();

function fallbackPoster(title: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(title.slice(0, 12))}&size=800&background=1a1a2e&color=e94560&bold=true&format=png`;
}

async function resolveEventImage(ev: ReturnType<typeof getMergedEventCatalog>[0]): Promise<string> {
  if (ev.imageUrl && isAllowedImageUrl(ev.imageUrl)) return ev.imageUrl;
  if (ev.eventPageUrl) {
    const og = await fetchOgImage(ev.eventPageUrl);
    if (og && isAllowedImageUrl(og)) return og;
  }
  return fallbackPoster(ev.title);
}

async function pruneStaleEvents(validSlugs: Set<string>) {
  const { data: existing } = await supabase.from("events").select("id, slug, title, event_date");
  const toDelete = (existing ?? []).filter((e) => !validSlugs.has(e.slug));

  if (toDelete.length === 0) return;

  console.log(`🗑️  Eliminando ${toDelete.length} eventos fuera de catálogo…`);
  for (const row of toDelete) {
    const { error } = await supabase.from("events").delete().eq("id", row.id);
    if (error) console.log(`  ✗ ${row.title}: ${error.message}`);
    else console.log(`  ✓ ${row.title}`);
  }
}

async function main() {
  const catalog = getMergedEventCatalog();
  const sorted = catalog.sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  console.log(
    `\n📅 Makina Hub — ${sorted.length} eventos en catálogo (manual + auto, desde ${todayEventDateISO()})\n`
  );

  const { data: artists } = await supabase.from("artists").select("id, slug");
  const bySlug = new Map((artists ?? []).map((a) => [a.slug, a.id]));

  let ok = 0;

  for (const ev of sorted) {
    const image_url = dryRun
      ? ev.imageUrl && isAllowedImageUrl(ev.imageUrl)
        ? ev.imageUrl
        : fallbackPoster(ev.title)
      : await resolveEventImage(ev);

    const row = {
      slug: ev.slug,
      title: ev.title,
      description: ev.description,
      event_date: `${ev.eventDate}T22:00:00+01:00`,
      city: ev.city,
      venue: ev.venue,
      image_url,
    };

    if (dryRun) {
      console.log(`· ${ev.eventDate} — ${ev.title}`);
      ok++;
      continue;
    }

    const { data: inserted, error } = await supabase
      .from("events")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .single();

    if (error || !inserted) {
      console.log(`✗ ${ev.title}: ${error?.message ?? "sin id"}`);
      continue;
    }

    const links = ev.artistSlugs
      .filter((s) => bySlug.has(s))
      .map((s) => ({ event_id: inserted.id, artist_id: bySlug.get(s)! }));

    if (links.length) {
      await supabase.from("event_artists").upsert(links, {
        onConflict: "event_id,artist_id",
        ignoreDuplicates: true,
      });
    }

    console.log(`✓ ${ev.eventDate} — ${ev.title} (${links.length} DJs)`);
    ok++;
  }

  if (!dryRun) {
    await pruneStaleEvents(new Set(sorted.map((e) => e.slug)));
  }

  const upcoming = sorted.filter((e) => e.eventDate >= todayEventDateISO()).length;
  console.log(`\n✅ ${ok}/${sorted.length} eventos (${upcoming} próximos)\n`);
  if ((artists ?? []).length === 0) {
    console.log("⚠️  Ejecuta antes: npm run db:discover-artists\n");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
