import { NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/newsletter/subscribers";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string };
    const token = body.token?.trim();

    if (!token || token.length < 20) {
      return NextResponse.json({ error: "Enlace no válido." }, { status: 400 });
    }

    const ok = await unsubscribeByToken(token);
    if (!ok) {
      return NextResponse.json(
        { error: "Este enlace ya no es válido o ya estabas desuscrito." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Te has desuscrito. No recibirás más emails de Makina Hub.",
    });
  } catch {
    return NextResponse.json({ error: "No se pudo procesar la petición." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Falta token." }, { status: 400 });
  }

  try {
    const ok = await unsubscribeByToken(token);
    return NextResponse.json({ ok, message: ok ? "Desuscripción confirmada." : "Enlace no válido." });
  } catch {
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 });
  }
}
