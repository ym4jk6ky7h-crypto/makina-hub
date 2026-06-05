import { ImageResponse } from "next/og";
import { getArtistBySlug } from "@/services/artists.service";

export const alt = "Artista — Makina Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function ArtistOgImage({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  const name = artist?.name ?? "Artista";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background:
            "linear-gradient(160deg, #0a0a12 0%, rgba(255,45,106,0.25) 50%, #1a1028 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p style={{ fontSize: 22, color: "#ff2d6a", fontWeight: 600, marginBottom: 12 }}>
          MAKINA HUB · ARTISTA
        </p>
        <p style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>
          {name}
        </p>
        {artist?.city && (
          <p style={{ fontSize: 26, color: "rgba(255,255,255,0.65)", marginTop: 16 }}>
            {artist.city}
            {artist.country ? ` · ${artist.country}` : ""}
          </p>
        )}
      </div>
    ),
    { ...size }
  );
}
