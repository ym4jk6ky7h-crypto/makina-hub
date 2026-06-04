export type YouTubeResult = {
  channelUrl: string | null;
  videoUrl: string | null;
  searchUrl: string;
};

/** Búsqueda en YouTube Data API v3 (requiere YOUTUBE_API_KEY) */
export async function fetchYouTubeForArtist(
  artistName: string,
  apiKey?: string
): Promise<YouTubeResult> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artistName} makina remember`)}`;

  if (!apiKey) {
    return { channelUrl: null, videoUrl: null, searchUrl };
  }

  try {
    const q = encodeURIComponent(`${artistName} makina remember DJ`);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${q}&key=${apiKey}&relevanceLanguage=es`
    );
    if (!res.ok) return { channelUrl: null, videoUrl: null, searchUrl };

    const data = (await res.json()) as {
      items?: Array<{ id?: { videoId?: string } }>;
    };
    const videoId = data.items?.[0]?.id?.videoId;
    if (!videoId) return { channelUrl: null, videoUrl: null, searchUrl };

    return {
      channelUrl: null,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      searchUrl,
    };
  } catch {
    return { channelUrl: null, videoUrl: null, searchUrl };
  }
}

export async function fetchYouTubeForTrack(
  artistName: string,
  trackTitle: string,
  apiKey?: string
): Promise<string | null> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artistName} ${trackTitle}`)}`;
  if (!apiKey) return searchUrl;

  try {
    const q = encodeURIComponent(`${artistName} ${trackTitle} makina`);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${q}&key=${apiKey}&relevanceLanguage=es`
    );
    if (!res.ok) return searchUrl;
    const data = (await res.json()) as {
      items?: Array<{ id?: { videoId?: string } }>;
    };
    const id = data.items?.[0]?.id?.videoId;
    return id ? `https://www.youtube.com/watch?v=${id}` : searchUrl;
  } catch {
    return searchUrl;
  }
}
