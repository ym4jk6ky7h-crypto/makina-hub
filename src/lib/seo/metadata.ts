import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

type PageMeta = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image,
  type = "website",
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/og-default.png`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
