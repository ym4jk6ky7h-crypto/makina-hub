"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtistaError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-makina-pink" aria-hidden />
      <h1 className="text-xl font-bold">No se pudo cargar el artista</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Puede ser un fallo temporal de conexión. Inténtalo de nuevo.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button type="button" variant="makina" onClick={reset}>
          Reintentar
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/artistas">Ver todos los artistas</Link>
        </Button>
      </div>
    </div>
  );
}
