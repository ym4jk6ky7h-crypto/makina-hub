import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/eventos",
    "/artistas",
    "/musica",
    "/novedades",
    "/sesiones",
    "/sellos",
    "/ask",
    "/buscar",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const supabase = await createClient();
    const [artists, tracks, events, sessions, labels, releases] =
      await Promise.all([
        supabase.from("artists").select("slug"),
        supabase.from("tracks").select("slug"),
        supabase.from("events").select("slug"),
        supabase.from("sessions").select("slug"),
        supabase.from("labels").select("slug"),
        supabase.from("new_releases").select("slug"),
      ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...(artists.data ?? []).map((a) => ({
        url: `${SITE_URL}/artistas/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...(tracks.data ?? []).map((t) => ({
        url: `${SITE_URL}/musica/${t.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...(events.data ?? []).map((e) => ({
        url: `${SITE_URL}/eventos/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...(sessions.data ?? []).map((s) => ({
        url: `${SITE_URL}/sesiones/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...(labels.data ?? []).map((l) => ({
        url: `${SITE_URL}/sellos/${l.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...(releases.data ?? []).map((r) => ({
        url: `${SITE_URL}/novedades/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
