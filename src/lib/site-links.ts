/** Enlaces externos de referencia en la escena */
export const EXTERNAL_LINKS = {
  makinaLegends: "https://www.makinalegends.com/",
  makinaLegendsEvents: "https://www.makinalegends.com/eventos/",
  discogs: "https://www.discogs.com/",
  youtube: "https://www.youtube.com/",
} as const;

export type EventViewMode = "cartel" | "compacta";

export const EVENT_VIEW_MODES: { id: EventViewMode; label: string }[] = [
  { id: "cartel", label: "Cartel" },
  { id: "compacta", label: "Lista compacta" },
];
