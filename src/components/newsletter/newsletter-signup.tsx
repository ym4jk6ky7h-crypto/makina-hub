"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewsletterSignupProps = {
  source?: string;
  compact?: boolean;
};

export function NewsletterSignup({ source = "footer", compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Error al suscribirte.");
        return;
      }

      setStatus("ok");
      setMessage(data.message ?? "Suscripción confirmada.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Inténtalo de nuevo.");
    }
  }

  if (status === "ok") {
    return (
      <p className="text-sm text-makina-cyan" role="status">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-2" : "space-y-3"}>
      {!compact && (
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Mail className="h-4 w-4 text-makina-pink" />
          Newsletter
        </p>
      )}
      <p className={compact ? "sr-only" : "text-sm text-muted-foreground"}>
        Eventos remember, sesiones nuevas y novedades del catálogo. Sin spam.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="border-white/10 bg-white/5"
          aria-label="Email para newsletter"
        />
        <Button
          type="submit"
          size="sm"
          className="btn-makina shrink-0"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Suscribirme"
          )}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
