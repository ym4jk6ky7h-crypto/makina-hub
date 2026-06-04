import type { NextConfig } from "next";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(root, ".env.local") });
config({ path: path.join(root, "CLAVES-SUPABASE.env"), override: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** No inyectar cadenas vacías: bloquean dotenv en runtime */
const publicEnv =
  supabaseUrl && supabaseKey
    ? {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabaseKey,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey,
        NEXT_PUBLIC_SITE_URL:
          process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      }
    : {};

const nextConfig: NextConfig = {
  env: publicEnv,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "i.discogs.com" },
      { protocol: "https", hostname: "img.discogs.com" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "www.makinalegends.com" },
      { protocol: "https", hostname: "makinalegends.com" },
      { protocol: "https", hostname: "www.barcelonarememberfestival.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },
    ],
  },
};

export default nextConfig;
