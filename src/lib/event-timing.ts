/** Etiquetas de fecha y agrupación por mes (zona Europe/Madrid) */

const TZ = "Europe/Madrid";

export function eventDateISO(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });
}

export type EventTimingBadge = "Hoy" | "Este fin de semana";

export function getEventTimingBadge(eventDate: string): EventTimingBadge | null {
  const day = eventDateISO(eventDate);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  if (day === today) return "Hoy";

  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: TZ })
  );
  now.setHours(0, 0, 0, 0);
  const eventDay = new Date(
    new Date(eventDate).toLocaleString("en-US", { timeZone: TZ })
  );
  eventDay.setHours(0, 0, 0, 0);

  const dow = now.getDay();
  const daysToSaturday = dow === 6 ? 0 : dow === 0 ? -1 : 6 - dow;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysToSaturday);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  if (eventDay >= saturday && eventDay <= sunday) return "Este fin de semana";
  return null;
}

export function monthKeyFromISO(iso: string): string {
  return eventDateISO(iso).slice(0, 7);
}

export function formatMonthHeading(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function groupByMonth<T extends { event_date: string }>(
  items: T[]
): { monthKey: string; heading: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = monthKeyFromISO(item.event_date);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, monthItems]) => ({
      monthKey,
      heading: formatMonthHeading(monthKey),
      items: monthItems,
    }));
}
