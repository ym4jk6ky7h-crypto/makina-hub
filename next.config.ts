import type { NextConfig } from "next";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { IMAGE_REMOTE_HOSTS } from "./src/lib/images/safe-image-url";

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
  async redirects() {
    return [
      {
        source: "/artist/:slug",
        destination: "/artistas/:slug",
        permanent: true,
      },
      {
        source: "/track/:slug",
        destination: "/novedades",
        permanent: true,
      },
      {
        source: "/musica",
        destination: "/novedades",
        permanent: true,
      },
      {
        source: "/musica/:slug",
        destination: "/novedades",
        permanent: true,
      },
      {
        source: "/session/:slug",
        destination: "/sesiones/:slug",
        permanent: true,
      },
      {
        source: "/event/:slug",
        destination: "/eventos/:slug",
        permanent: true,
      },
      {
        source: "/analyzr",
        destination: "/analyzr-vinyl",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      ...IMAGE_REMOTE_HOSTS.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
