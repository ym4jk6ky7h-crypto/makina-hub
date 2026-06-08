import { NextResponse } from "next/server";
import { createUnsubscribeToken } from "@/lib/newsletter/unsubscribe-token";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; source?: string };
    const email = body.email?.trim().toLowerCase();
    const source = body.source?.trim().slice(0, 40) || "footer";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Introduce un email válido." }, { status: 400 });
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch {
      return NextResponse.json(
        { error: "Newsletter no disponible todavía. Vuelve a intentarlo más tarde." },
        { status: 503 }
      );
    }

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("unsubscribe_token")
      .eq("email", email)
      .maybeSingle();

    const unsubscribe_token =
      existing?.unsubscribe_token ?? createUnsubscribeToken();

    const { error } = await supabase.from("newsletter_subscribers").upsert(
      {
        email,
        source,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
        unsubscribe_token,
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Newsletter subscribe error:", error);
      return NextResponse.json(
        { error: "No se pudo guardar la suscripción." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "¡Listo! Te avisaremos de eventos, sesiones y novedades de la escena mákina.",
    });
  } catch {
    return NextResponse.json({ error: "Petición no válida." }, { status: 400 });
  }
}
