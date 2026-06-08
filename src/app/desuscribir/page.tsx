import { Suspense } from "react";
import { UnsubscribeContent } from "./unsubscribe-content";

export const metadata = {
  title: "Desuscribir newsletter",
  robots: { index: false, follow: false },
};

export default function DesuscribirPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-muted-foreground">Cargando…</p>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
