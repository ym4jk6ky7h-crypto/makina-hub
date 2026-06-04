import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildDatabaseContextForAI } from "@/lib/ai/context";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query requerida" }, { status: 400 });
    }

    const dbContext = await buildDatabaseContextForAI();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        answer:
          "OpenAI no está configurado. Añade OPENAI_API_KEY en .env.local. La base de datos Supabase está activa — prueba el buscador global mientras tanto.",
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres Makina AI, experto en música mákina, remember y hardcore española.
Responde en español. Usa SOLO esta base de datos:

${dbContext}`,
        },
        { role: "user", content: query },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "No pude generar una respuesta.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Error al procesar la consulta" },
      { status: 500 }
    );
  }
}
