import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Sin conexión",
  path: "/offline",
  description: "No hay conexión a internet. Vuelve a intentarlo cuando estés online.",
});

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <WifiOff className="h-8 w-8 text-makina-pink" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold">Sin conexión</h1>
      <p className="mt-3 text-muted-foreground">
        Makina Hub necesita internet para cargar artistas, eventos y música. Comprueba la red
        e inténtalo de nuevo.
      </p>
      <Button asChild className="btn-makina mt-8">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
