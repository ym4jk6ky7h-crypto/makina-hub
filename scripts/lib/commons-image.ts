const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Busca foto en Wikimedia Commons (archivos libres). */
export async function fetchCommonsImage(searchTerm: string): Promise<string | null> {
  try {
    const url = new URL(COMMONS_API);
    url.searchParams.set("action", "query");
    url.searchParams.set("generator", "search");
    url.searchParams.set("gsrsearch", `${searchTerm} DJ OR disc jockey`);
    url.searchParams.set("gsrnamespace", "6");
    url.searchParams.set("gsrlimit", "3");
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url");
    url.searchParams.set("iiurlwidth", "640");
    url.searchParams.set("format", "json");
    url.searchParams.set("origin", "*");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "MakinaHub/1.0 (educational music database)" },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          { title?: string; imageinfo?: Array<{ thumburl?: string; url?: string }> }
        >;
      };
    };

    for (const page of Object.values(data.query?.pages ?? {})) {
      const info = page.imageinfo?.[0];
      const img = info?.thumburl ?? info?.url;
      if (img && !img.endsWith(".svg")) return img;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchCommonsImageBest(terms: string[]): Promise<string | null> {
  for (const term of [...new Set(terms.filter(Boolean))]) {
    const img = await fetchCommonsImage(term);
    if (img) return img;
    await sleep(200);
  }
  return null;
}
