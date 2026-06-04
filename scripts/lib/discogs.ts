const DISCOGS_API = "https://api.discogs.com";

export type DiscogsResult = {
  id: number | null;
  name: string | null;
  profile: string | null;
  imageUrl: string | null;
  discogsUrl: string | null;
  realName: string | null;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchDiscogsArtist(
  artistName: string,
  token?: string
): Promise<DiscogsResult> {
  const empty: DiscogsResult = {
    id: null,
    name: null,
    profile: null,
    imageUrl: null,
    discogsUrl: null,
    realName: null,
  };

  if (!token) return empty;

  try {
    const q = encodeURIComponent(`${artistName} makina`);
    const res = await fetch(
      `${DISCOGS_API}/database/search?q=${q}&type=artist&per_page=3`,
      {
        headers: {
          Authorization: `Discogs token=${token}`,
          "User-Agent": "MakinaHub/1.0",
        },
      }
    );
    if (!res.ok) return empty;

    const data = (await res.json()) as {
      results?: Array<{ id: number; title: string; thumb?: string }>;
    };
    const hit = data.results?.[0];
    if (!hit) return empty;

    await sleep(1100);

    const detailRes = await fetch(`${DISCOGS_API}/artists/${hit.id}`, {
      headers: {
        Authorization: `Discogs token=${token}`,
        "User-Agent": "MakinaHub/1.0",
      },
    });
    if (!detailRes.ok) {
      return {
        id: hit.id,
        name: hit.title,
        profile: null,
        imageUrl: hit.thumb ?? null,
        discogsUrl: `https://www.discogs.com/artist/${hit.id}`,
        realName: null,
      };
    }

    const d = (await detailRes.json()) as {
      name?: string;
      profile?: string;
      realname?: string;
      images?: Array<{ uri: string; type: string }>;
      uri?: string;
    };

    const primary =
      d.images?.find((i) => i.type === "primary")?.uri ??
      d.images?.[0]?.uri ??
      hit.thumb ??
      null;

    return {
      id: hit.id,
      name: d.name ?? hit.title,
      profile: d.profile?.slice(0, 1500) ?? null,
      imageUrl: primary,
      discogsUrl: d.uri ?? `https://www.discogs.com/artist/${hit.id}`,
      realName: d.realname ?? null,
    };
  } catch {
    return empty;
  }
}
