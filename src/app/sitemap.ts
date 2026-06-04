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
    "/vinilos",
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
    const [artists, tracks, events, sessions, vinyls, labels, releases] =
      await Promise.all([
        supabase.from("artists").select("slug"),
        supabase.from("tracks").select("slug"),
        supabase.from("events").select("slug"),
        supabase.from("sessions").select("slug"),
        supabase.from("vinyls").select("slug"),
        supabase.from("labels").select("slug"),
        supabase.from("new_releases").select("slug"),
      ]);

    const dynamicRoutes = [
      ...(artists.data ?? []).map((a) => ({
        url: `${SITE_URL}/artistas/${a.slug}`,
        pathEn: `/artist/${a.slug}`,
      })),
      ...(tracks.data ?? []).map((t) => ({
        url: `${SITE_URL}/musica/${t.slug}`,
        pathEn: `/track/${t.slug}`,
      })),
      ...(events.data ?? []).map((e) => ({
        url: `${SITE_URL}/eventos/${e.slug}`,
        pathEn: `/event/${e.slug}`,
      })),
      ...(sessions.data ?? []).map((s) => ({
        url: `${SITE_URL}/sesiones/${s.slug}`,
        pathEn: `/session/${s.slug}`,
      })),
      ...(vinyls.data ?? []).map((v) => ({
        url: `${SITE_URL}/vinilos/${v.slug}`,
        pathEn: `/vinyl/${v.slug}`,
      })),
      ...(labels.data ?? []).map((l) => ({
        url: `${SITE_URL}/sellos/${l.slug}`,
        pathEn: null,
      })),
      ...(releases.data ?? []).map((r) => ({
        url: `${SITE_URL}/novedades/${r.slug}`,
        pathEn: null,
      })),
    ].flatMap((item) => {
      const entries: MetadataRoute.Sitemap = [
        {
          url: item.url,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        },
      ];
      if ("pathEn" in item && item.pathEn) {
        entries.push({
          url: `${SITE_URL}${item.pathEn}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
      return entries;
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
