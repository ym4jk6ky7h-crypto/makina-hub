import { SessionCard } from "@/components/cards/session-card";
import { PageHero } from "@/components/layout/page-hero";
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

    return (
      <>
        <PageHero
          title="Sesiones"
          subtitle="Sets de la escena mákina catalana en YouTube — clic para ver el vídeo."
          image={SITE_IMAGES.heroSessions}
          badge={`${sessions.length} sesiones`}
        />
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No hay sesiones. Ejecuta{" "}
              <code className="text-xs">npm run db:discover-sessions</code> (recomendado
              con YOUTUBE_API_KEY en .env.local).
            </p>
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
