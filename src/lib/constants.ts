import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Disc3,
  Headphones,
  Home,
  Mic2,
  Music2,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
} from "lucide-react";

export const SITE_NAME = "Makina Hub";
export const SITE_TAGLINE = "La enciclopedia de la mákina catalana";
export const SITE_DESCRIPTION =
  "La plataforma de referencia de la música mákina, remember y makina revival en Catalunya. Artistas, eventos, sesiones, sellos y vinilos.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://makina-hub.vercel.app";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  group: "escena" | "catalogo" | "tools";
  highlight?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home, group: "escena" },
  { href: "/eventos", label: "Eventos", icon: Calendar, group: "escena" },
  { href: "/artistas", label: "Artistas", icon: Mic2, group: "escena" },
  { href: "/musica", label: "Música", icon: Music2, group: "catalogo" },
  {
    href: "/novedades",
    label: "Novedades",
    icon: ShoppingBag,
    group: "catalogo",
  },
  { href: "/sesiones", label: "Sesiones", icon: Headphones, group: "catalogo" },
  { href: "/sellos", label: "Sellos", icon: Tag, group: "catalogo" },
  { href: "/vinilos", label: "Vinilos", icon: Disc3, group: "catalogo" },
  {
    href: "/ask",
    label: "Ask Makina AI",
    icon: Sparkles,
    group: "tools",
    highlight: true,
  },
];

export const NAV_GROUPS = {
  escena: "Escena",
  catalogo: "Catálogo",
  tools: "Herramientas",
} as const;

/** Barra inferior móvil (5 accesos rápidos) */
export const MOBILE_TAB_NAV = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/artistas", label: "Artistas", icon: Mic2 },
  { href: "/musica", label: "Música", icon: Music2 },
  { href: "/buscar", label: "Buscar", icon: Search },
] as const;

export const EVENT_CITIES = [
  "Barcelona",
  "Sabadell",
  "Terrassa",
  "Girona",
  "Granollers",
  "Lleida",
  "Reus",
  "Tarragona",
  "Montmeló",
  "Rubí",
  "Vic",
  "Mollet del Vallès",
  "Molins de Rei",
  "Viladecans",
  "Palafrugell",
  "Platja d'Aro",
  "Empuriabrava",
  "Badalona",
  "L'Hospitalet de Llobregat",
  "Vilanova i la Geltrú",
  "Olot",
  "Figueres",
  "Cambrils",
  "Mataró",
] as const;

export const GENRES = [
  "makina",
  "remember",
  "hardcore",
  "makina-revival",
  "bouncy",
  "hard-dance",
] as const;
