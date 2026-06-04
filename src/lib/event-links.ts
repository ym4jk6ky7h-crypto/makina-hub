/** Enlaces de calendario y mapas para eventos */

export type EventLocationFields = {
  title: string;
  description: string;
  event_date: string;
  venue: string;
  city: string;
  slug: string;
};

function formatIcsDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** Google Calendar — añadir evento */
export function googleCalendarUrl(event: EventLocationFields): string {
  const start = new Date(event.event_date);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const dates = `${formatIcsDate(start.toISOString())}/${formatIcsDate(end.toISOString())}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: event.description.slice(0, 800),
    location: `${event.venue}, ${event.city}, Catalunya`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Google Maps — cómo llegar */
export function googleMapsUrl(venue: string, city: string): string {
  const query = encodeURIComponent(`${venue}, ${city}, Catalunya, España`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Contenido .ics para descarga */
export function buildIcsContent(event: EventLocationFields): string {
  const start = new Date(event.event_date);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const uid = `${event.slug}@makinahub`;
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Makina Hub//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${formatIcsDate(start.toISOString())}`,
    `DTEND:${formatIcsDate(end.toISOString())}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description.slice(0, 1000))}`,
    `LOCATION:${escape(`${event.venue}, ${event.city}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
