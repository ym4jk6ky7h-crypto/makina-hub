/**
 * npm run db:discover-labels
 */
import { MAKINA_LABELS } from "../data/makina-labels";
import { createAdminClient, loadEnv } from "./lib/supabase-admin";

loadEnv();

const dryRun = process.argv.includes("--dry-run");
const discogsToken = process.env.DISCOGS_TOKEN;
const supabase = createAdminClient();

function labelLogoFallback(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=1a1020&color=e8b84a&bold=true&format=png`;
}

async function discogsLabelThumb(name: string): Promise<string | null> {
  if (!discogsToken) return null;
  try {
    const q = encodeURIComponent(name);
    const res = await fetch(
      `https://api.discogs.com/database/search?q=${q}&type=label&per_page=1`,
      {
        headers: {
          Authorization: `Discogs token=${discogsToken}`,
          "User-Agent": "MakinaHub/1.0",
        },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: Array<{ thumb?: string; cover_image?: string }>;
    };
    return data.results?.[0]?.cover_image ?? data.results?.[0]?.thumb ?? null;
  } catch {
    return null;
  }
}

async function main() {
  console.log(`\n🏷️  Makina Hub — ${MAKINA_LABELS.length} sellos catalanes\n`);

  for (const label of MAKINA_LABELS) {
    const thumb = await discogsLabelThumb(label.name);
    const logo_url = thumb ?? labelLogoFallback(label.name);

    const row = {
      slug: label.slug,
      name: label.name,
      description: label.description,
      founded_year: label.founded ?? null,
      logo_url,
    };

    if (dryRun) {
      console.log(`· ${label.name}`);
      continue;
    }

    const { error } = await supabase.from("labels").upsert(row, { onConflict: "slug" });
    console.log(error ? `✗ ${label.name}: ${error.message}` : `✓ ${label.name}`);
    await new Promise((r) => setTimeout(r, discogsToken ? 1100 : 50));
  }

  console.log("\n✅ Sellos sincronizados\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
