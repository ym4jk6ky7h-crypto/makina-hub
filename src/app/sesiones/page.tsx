import { Headphones } from "lucide-react";
import { SessionCard } from "@/components/cards/session-card";
import { PageHero } from "@/components/layout/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { SetupRequired } from "@/components/setup/setup-required";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_IMAGES } from "@/lib/site-images";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/config";
import { listSessions } from "@/services/sessions.service";

export const metadata = buildMetadata({
  title: "Sesiones",
  description:
    "Sesiones DJ de mákina y remember en YouTube con miniatura y enlace directo.",
  path: "/sesiones",
});

export default async function SesionesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <SetupRequired message="Faltan credenciales en CLAVES-SUPABASE.env. Reinicia npm run dev." />
    );
  }

  try {
    const sessions = await listSessions();
    const withEmbed = sessions.filter(
      (s) => s.youtube_url?.includes("watch?v=") || s.youtube_url?.includes("youtu.be/")
    ).length;

    return (
      <>
        <PageHero
          title="Sesiones"
          subtitle="Sets de la escena mákina catalana en YouTube — clic para ver el vídeo."
          image={SITE_IMAGES.heroSessions}
          badge={`${sessions.length} sesiones`}
        />
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {sessions.length > 0 && withEmbed === 0 && (
            <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
              Las sesiones abren <strong>YouTube</strong> (búsqueda del DJ). Si tu clave de YouTube
              tiene cuota, ejecuta mañana{" "}
              <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
                npm run db:discover-sessions
              </code>{" "}
              para activar el reproductor embebido.
            </p>
          )}
          {sessions.length === 0 ? (
            <EmptyState
              icon={Headphones}
              title="No hay sesiones todavía"
              description="Vinculamos cada artista del roster con un set en YouTube. Ejecuta el script de sincronización en tu Mac."
              hint={
                <code className="rounded bg-white/5 px-2 py-1 text-xs">
                  npm run db:discover-sessions
                </code>
              }
              actions={[{ label: "Ver artistas", href: "/artistas", variant: "outline" }]}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : formatSupabaseError(error);
    return <SetupRequired message={message} />;
  }
}
