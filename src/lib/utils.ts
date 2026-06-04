import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, locale = "es-ES") {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatGenre(genre: string) {
  const labels: Record<string, string> = {
    makina: "Mákina",
    remember: "Remember",
    hardcore: "Hardcore",
    "makina-revival": "Mákina Revival",
    bouncy: "Bouncy",
    "hard-dance": "Hard Dance",
  };
  return labels[genre] ?? genre;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
