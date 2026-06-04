export type WikiResult = {
  title: string;
  extract: string;
  thumbnailUrl: string | null;
  wikipediaUrl: string;
  found: boolean;
};

const WIKI_API = "https://es.wikipedia.org/w/api.php";
const WIKI_REST = "https://es.wikipedia.org/api/rest_v1/page/summary";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function upscaleWikiThumb(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\/(\d+)px-/, "/640px-");
}

/** Busca página en Wikipedia (es) y devuelve resumen + imagen */
export async function fetchWikipediaArtist(
  searchTerm: string
): Promise<WikiResult> {
  const empty: WikiResult = {
    title: searchTerm,
    extract: "",
    thumbnailUrl: null,
    wikipediaUrl: "",
    found: false,
  };

  try {
    const searchUrl = new URL(WIKI_API);
    searchUrl.searchParams.set("action", "opensearch");
    searchUrl.searchParams.set("search", searchTerm);
    searchUrl.searchParams.set("limit", "1");
    searchUrl.searchParams.set("namespace", "0");
    searchUrl.searchParams.set("format", "json");

    const searchRes = await fetch(searchUrl.toString(), {
      headers: { "User-Agent": "MakinaHub/1.0 (educational music database)" },
    });
    const searchData = (await searchRes.json()) as [string, string[], string[], string[]];
    const pageTitle = searchData[1]?.[0];
    if (!pageTitle) return empty;

    await sleep(150);

    const summaryUrl = `${WIKI_REST}/${encodeURIComponent(pageTitle.replace(/ /g, "_"))}`;
    const summaryRes = await fetch(summaryUrl, {
      headers: { "User-Agent": "MakinaHub/1.0 (educational music database)" },
    });

    if (!summaryRes.ok) return { ...empty, title: pageTitle };

    const summary = (await summaryRes.json()) as {
      title?: string;
      extract?: string;
      description?: string;
      thumbnail?: { source?: string };
      content_urls?: { desktop?: { page?: string } };
    };

    const extract = [summary.description, summary.extract]
      .filter(Boolean)
      .join(". ")
      .slice(0, 2800);

    return {
      title: summary.title ?? pageTitle,
      extract: extract || "",
      thumbnailUrl: upscaleWikiThumb(summary.thumbnail?.source ?? null),
      wikipediaUrl: summary.content_urls?.desktop?.page ?? "",
      found: Boolean(extract),
    };
  } catch {
    return empty;
  }
}

/** Prueba varios términos; prioriza resultado con foto. */
export async function fetchWikipediaArtistBest(
  searchTerms: string[]
): Promise<WikiResult> {
  const unique = [...new Set(searchTerms.map((t) => t.trim()).filter(Boolean))];
  let best: WikiResult | null = null;

  for (const term of unique) {
    const result = await fetchWikipediaArtist(term);
    if (result.found && result.thumbnailUrl) return result;
    if (result.found && !best) best = result;
  }

  return best ?? { title: unique[0] ?? "", extract: "", thumbnailUrl: null, wikipediaUrl: "", found: false };
}

export function avatarFallback(name: string): string {
  const encoded = encodeURIComponent(name.replace(/&/g, "and"));
  return `https://ui-avatars.com/api/?name=${encoded}&size=512&background=1a1a2e&color=ff2d6a&bold=true`;
}
