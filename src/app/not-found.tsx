import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-makina-pink/30">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página no encontrada</h1>
      <p className="mt-2 text-muted-foreground">
        Este tema, evento o artista no está en la base de datos.
      </p>
      <Link href="/" className="mt-6">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  );
}
