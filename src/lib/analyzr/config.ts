/**
 * Configuración comercial de Analyzr (app iOS de análisis DJ).
 * URLs en Vercel / CLAVES-SUPABASE.env cuando publiques en App Store.
 */

export const ANALYZR_NAME = "Analyzr";
export const ANALYZR_TAGLINE = "BPM, tonalidad y estructura DJ en tu iPhone";
export const ANALYZR_DESCRIPTION =
  "Apunta el micrófono, graba unos segundos y obtén BPM, KEY y estructura en notación de cabina — 100 % offline, pensado para makina y hard dance.";

export type AnalyzrTier = {
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

export function getAnalyzrTiers(): AnalyzrTier[] {
  const freeUrl =
    envUrl("NEXT_PUBLIC_ANALYZR_FREE_URL") ??
    envUrl("NEXT_PUBLIC_ANALYZR_APP_STORE_URL");
  const proUrl = envUrl("NEXT_PUBLIC_ANALYZR_PRO_URL");

  return [
    {
      id: "free",
      name: "Gratis",
      price: "0 €",
      priceNote: "Para empezar en cabina",
      cta: freeUrl ? "Descargar gratis" : "Ver cómo funciona",
      href: freeUrl ?? "/analyzr#descargar",
      features: [
        "BPM y tonalidad (KEY) offline",
        "Preset Makina / Hard (165–195 BPM)",
        "Medidor de entrada en tiempo real",
        "Última sesión guardada",
        "Copiar estructura al portapapeles",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "4,99 €",
      priceNote: "Pago único · sin suscripción",
      cta: proUrl ? "Conseguir Pro" : "Lista de espera Pro",
      href: proUrl ?? "/analyzr#pro",
      highlighted: true,
      features: [
        "Todo lo de Gratis",
        "Estructura DJ completa (frases 32 beats)",
        "Historial ilimitado de análisis",
        "Todos los presets: Techno, House, DnB…",
        "Panel técnico y ajuste fino de BPM",
        "Prioridad en nuevas funciones",
      ],
    },
  ];
}

export const ANALYZR_FEATURES = [
  {
    title: "100 % offline",
    description: "Sin nube, sin cuenta, sin internet. Tu audio no sale del iPhone.",
  },
  {
    title: "Hecho para mákina",
    description: "Preset Makina/Hard y rango 165–195 BPM optimizado para la escena.",
  },
  {
    title: "Estructura de cabina",
    description: "Notación DJ real: 8)4(2)4(2)8)16 — cada número es un compás.",
  },
  {
    title: "Micrófono → resultados",
    description: "START, deja grabar 8–20 s, STOP. BPM, KEY y estructura al instante.",
  },
] as const;

export const ANALYZR_STEPS = [
  {
    step: "01",
    title: "Apunta al altavoz",
    description: "En la cabina, en la pista o desde otro móvil. El medidor VU te guía.",
  },
  {
    step: "02",
    title: "Graba y para",
    description: "Mínimo 8 segundos; 20+ recomendado para estructura fiable.",
  },
  {
    step: "03",
    title: "Analiza en local",
    description: "BPM, tonalidad y frases DJ procesados en el propio iPhone.",
  },
] as const;

export const ANALYZR_REQUIREMENTS = [
  "iPhone con iOS 17 o superior",
  "Micrófono (permiso en el primer uso)",
  "Volumen suficiente cerca del altavoz",
  "Dispositivo real (no Simulador)",
] as const;

/** Demo visual en mockups (valores de ejemplo makina). */
export const ANALYZR_DEMO = {
  bpm: 175,
  key: "Am",
  structure: "8)4(2)4(2)8)16",
  quality: "Buena señal",
  confidence: 94,
} as const;
