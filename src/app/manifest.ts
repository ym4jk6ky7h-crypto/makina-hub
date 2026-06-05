import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Makina Hub",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070708",
    theme_color: "#ff2d6a",
    orientation: "portrait-primary",
    lang: "es",
    dir: "ltr",
    categories: ["music", "entertainment"],
    icons: [
      {
        src: "/icons/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Artistas",
        short_name: "Artistas",
        url: "/artistas",
        icons: [{ src: "/icons/icon-192", sizes: "192x192" }],
      },
      {
        name: "Eventos",
        short_name: "Eventos",
        url: "/eventos",
        icons: [{ src: "/icons/icon-192", sizes: "192x192" }],
      },
      {
        name: "Mis favoritos",
        short_name: "Favoritos",
        url: "/favoritos",
        icons: [{ src: "/icons/icon-192", sizes: "192x192" }],
      },
    ],
  };
}
