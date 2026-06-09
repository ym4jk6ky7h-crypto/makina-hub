/**
 * Analyzr Vinyl — producto vinilo en Makina Hub (no confundir con Analyzr).
 * URLs en Vercel cuando publiques descarga / tienda.
 */

export const ANALYZR_VINYL_NAME = "Analyzr Vinyl";
export const ANALYZR_NAME = ANALYZR_VINYL_NAME; // alias interno legacy
export const ANALYZR_VINYL_TAGLINE = "Tu escena mákina en vinilo, catalogada";
export const ANALYZR_TAGLINE = ANALYZR_VINYL_TAGLINE;
export const ANALYZR_VINYL_DESCRIPTION =
  "Organiza tu colección de vinilos remember y mákina, descubre lanzamientos del catálogo Makina Hub y lleva tu biblioteca de pista a cualquier sitio.";
export const ANALYZR_DESCRIPTION = ANALYZR_VINYL_DESCRIPTION;
export const ANALYZR_COMING_SOON_NOTE =
  "Analyzr (app principal) llegará más adelante. Esta sección es Analyzr Vinyl.";

export type AnalyzrVinylTier = {
  id: "free" | "pro";
  name: string;
  price: string;
  priceNote: string;
  cta: string;
  href: string | null;
  highlighted?: boolean;
  features: string[];
};

function envUrl(key: string): string | null {
  const v = process.env[key]?.trim();
  return v && v.startsWith("http") ? v : null;
}

export function getAnalyzrVinylTiers(): AnalyzrVinylTier[] {
  const freeUrl =
    envUrl("NEXT_PUBLIC_ANALYZR_VINYL_FREE_URL") ??
    envUrl("NEXT_PUBLIC_ANALYZR_FREE_URL") ??
    envUrl("NEXT_PUBLIC_ANALYZR_APP_STORE_URL");
  const proUrl =
    envUrl("NEXT_PUBLIC_ANALYZR_VINYL_PRO_URL") ?? envUrl("NEXT_PUBLIC_ANALYZR_PRO_URL");

  return [
    {
      id: "free",
      name: "Gratis",
      price: "0 €",
      priceNote: "Para empezar con tu colección",
      cta: freeUrl ? "Descargar gratis" : "Ver Analyzr Vinyl",
      href: freeUrl ?? "/analyzr-vinyl#descargar",
      features: [
        "Catálogo personal de vinilos",
        "Sincronizado con artistas y sellos de Makina Hub",
        "Búsqueda por DJ, sello o título",
        "Listado de novedades de la escena",
        "Modo consulta sin conexión (próximamente)",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "Próximamente",
      priceNote: "Precio final cuando publiquemos",
      cta: proUrl ? "Conseguir Pro" : "Avisarme de Pro",
      href: proUrl ?? "/analyzr-vinyl#pro",
      highlighted: true,
      features: [
        "Todo lo de Gratis",
        "Colección ilimitada + etiquetas",
        "Listas para cabina y sesiones",
        "Historial de adquisiciones",
        "Exportar colección",
        "Acceso anticipado a funciones nuevas",
      ],
    },
  ];
}

export const getAnalyzrTiers = getAnalyzrVinylTiers;

export const ANALYZR_VINYL_FEATURES = [
  {
    title: "Hecho para la mákina",
    description: "Artistas, sellos y novedades del catálogo Makina Hub, pensado para DJs de vinilo.",
  },
  {
    title: "Tu colección",
    description: "Guarda qué tienes en estantería y qué te falta — sin hojas de cálculo.",
  },
  {
    title: "Descubrimiento",
    description: "Novedades con enlace de compra y referencias de la escena catalana.",
  },
  {
    title: "Gratis y Pro",
    description: "Empieza sin pagar; la versión Pro ampliará herramientas de cabina.",
  },
] as const;

export const ANALYZR_FEATURES = ANALYZR_VINYL_FEATURES;

export const ANALYZR_VINYL_STEPS = [
  {
    step: "01",
    title: "Explora el catálogo",
    description: "Artistas, sellos y novedades curadas en Makina Hub.",
  },
  {
    step: "02",
    title: "Añade tus vinilos",
    description: "Marca lo que tienes, lo que buscas y tus favoritos de pista.",
  },
  {
    step: "03",
    title: "Llévalo a la cabina",
    description: "Consulta tu colección antes de pinchar o comprar el siguiente disco.",
  },
] as const;

export const ANALYZR_STEPS = ANALYZR_VINYL_STEPS;

export const ANALYZR_VINYL_REQUIREMENTS = [
  "Compatible con web y app (cuando publiquemos)",
  "Cuenta opcional — muchas funciones sin registro",
  "Conexión para sincronizar novedades del hub",
] as const;

export const ANALYZR_REQUIREMENTS = ANALYZR_VINYL_REQUIREMENTS;

/** Demo visual en mockups (vinilo de ejemplo). */
export const ANALYZR_VINYL_DEMO = {
  artist: "Skudero",
  title: "Flying Free",
  label: "Pont Aeri",
  year: "1995",
  bpm: "175",
  genre: "Mákina",
} as const;

export const ANALYZR_DEMO = ANALYZR_VINYL_DEMO;

export const ANALYZR_VINYL_PATH = "/analyzr-vinyl";
