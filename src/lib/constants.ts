import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Headphones,
  Heart,
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
  "La plataforma de referencia de la música mákina, remember y makina revival en Catalunya. Artistas, eventos, sesiones y sellos.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://makina-hub.vercel.app";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  group: "escena" | "catalogo" | "tools";
  /** Enlaces principales (barra desktop); el resto va en «Más» */
  primary?: boolean;
  highlight?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home, group: "escena" },
  {
    href: "/eventos",
    label: "Eventos",
    icon: Calendar,
    group: "escena",
    primary: true,
  },
  {
    href: "/artistas",
    label: "Artistas",
    icon: Mic2,
    group: "escena",
    primary: true,
  },
  {
    href: "/musica",
    label: "Música",
    icon: Music2,
    group: "catalogo",
    primary: true,
  },
  {
    href: "/novedades",
    label: "Novedades",
    icon: ShoppingBag,
    group: "catalogo",
    primary: true,
  },
  { href: "/sesiones", label: "Sesiones", icon: Headphones, group: "catalogo" },
  { href: "/sellos", label: "Sellos", icon: Tag, group: "catalogo" },
  { href: "/favoritos", label: "Mis favoritos", icon: Heart, group: "tools" },
  {
    href: "/ask",
    label: "Ask Makina AI",
    icon: Sparkles,
    group: "tools",
    highlight: true,
  },
];

export const NAV_PRIMARY = NAV_ITEMS.filter((i) => i.primary);
export const NAV_MORE = NAV_ITEMS.filter((i) => !i.primary && i.href !== "/");

export const SEARCH_EXAMPLES = [
  { label: "Pastis & Buenri", q: "Pastis" },
  { label: "Makina Legends", q: "Makina Legends" },
  { label: "Barcelona", q: "Barcelona" },
  { label: "Chimo Bayo", q: "Chimo Bayo" },
] as const;

export type SearchTab =
  | "todos"
  | "artistas"
  | "eventos"
  | "musica"
  | "sesiones"
  | "sellos";

export const SEARCH_TABS: { id: SearchTab; label: string }[] = [
  { id: "todos", label: "Todo" },
  { id: "artistas", label: "Artistas" },
  { id: "eventos", label: "Eventos" },
  { id: "musica", label: "Música" },
  { id: "sesiones", label: "Sesiones" },
  { id: "sellos", label: "Sellos" },
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
