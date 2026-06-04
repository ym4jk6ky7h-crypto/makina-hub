"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTIONS = [
  "Temas parecidos a Flying Free",
  "DJs similares a Pastis y Buenri",
  "Eventos remember este mes",
  "Canciones de 1998",
];

export function AskMakinaForm() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al consultar");
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pregunta sobre mákina, remember, eventos…"
          className="flex-1 bg-secondary/50"
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Preguntar
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQuery(s)}
            className="rounded-full border border-white/10 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-makina-cyan/30 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-6 glass-card p-6">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-makina-cyan">
            <Sparkles className="h-4 w-4" />
            Makina AI
          </p>
          <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}
