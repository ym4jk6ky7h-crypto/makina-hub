import { buildIcsContent } from "@/lib/event-links";
import { getEventBySlug } from "@/services/events.service";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return new Response("Evento no encontrado", { status: 404 });
  }

  const ics = buildIcsContent(event);

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
