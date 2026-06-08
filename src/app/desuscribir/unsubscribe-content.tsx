"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Enlace de desuscripción no válido.");
      return;
    }

    let cancelled = false;

    async function unsubscribe() {
      setStatus("loading");
      try {
        const res = await fetch("/api/newsletter/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = (await res.json()) as { message?: string; error?: string };

        if (cancelled) return;

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? "No se pudo desuscribir.");
          return;
        }

        setStatus("ok");
        setMessage(data.message ?? "Desuscripción confirmada.");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Error de conexión.");
        }
      }
    }

    unsubscribe();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">Newsletter</h1>
      {status === "loading" && (
        <p className="mt-4 text-muted-foreground">Procesando desuscripción…</p>
      )}
      {status === "ok" && (
        <>
          <p className="mt-4 text-makina-cyan">{message}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Puedes seguir visitando Makina Hub cuando quieras.
          </p>
        </>
      )}
      {status === "error" && (
        <p className="mt-4 text-destructive" role="alert">
          {message}
        </p>
      )}
      <Button asChild variant="outline" className="mt-8">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
