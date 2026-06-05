import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Headphones } from "lucide-react";
import { DetailPlayerSection } from "@/components/media/detail-player-section";
import { PlayYoutubeButton } from "@/components/ui/play-youtube-button";
import { buildMetadata } from "@/lib/seo/metadata";
import { resolveSessionPlay } from "@/lib/session-play";
import { getSessionThumbnail } from "@/lib/session-thumbnail";
import { getSessionBySlug } from "@/services/sessions.service";
import { formatDate } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);
  if (!session) return {};
  return buildMetadata({
    title: session.title,
    description: `Sesión de ${session.artist?.name ?? "DJ"} — ${formatDate(session.created_at)}`,
    path: `/sesiones/${slug}`,
  });
}

export default async function SesionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);
  if (!session) notFound();

  const { videoId, youtubeHref, watchUrl, isSearch } = resolveSessionPlay(session);
  const { url: thumb, fromYoutube } = getSessionThumbnail(session);

  return (
    <article className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="glass-card p-8">
          {videoId ? (
            <DetailPlayerSection
              videoId={videoId}
              title={session.title}
              watchUrl={watchUrl ?? youtubeHref}
              subtitle={session.artist?.name ?? "Sesión"}
            />
          ) : thumb ? (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-secondary">
              {youtubeHref ? (
                <a
                  href={youtubeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label="Abrir en YouTube"
                />
              ) : null}
              <Image
                src={thumb}
                alt={session.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
                unoptimized={!fromYoutube}
              />
            </div>
          ) : (
            <Headphones className="mb-4 h-10 w-10 text-makina-purple" />
          )}

          <h1 className="text-2xl font-bold lg:text-3xl">{session.title}</h1>
          {session.artist && (
            <Link
              href={`/artistas/${session.artist.slug}`}
              className="mt-2 block text-makina-pink hover:underline"
            >
              {session.artist.name}
            </Link>
          )}
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>{formatDate(session.created_at)}</span>
            {session.duration != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.duration} minutos
              </span>
            )}
          </div>
          {!videoId && youtubeHref && (
            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                {isSearch
                  ? "No hay un vídeo fijo en la base de datos; te llevamos a resultados en YouTube."
                  : "Abre el enlace para escuchar."}
              </p>
              <PlayYoutubeButton
                href={youtubeHref}
                label="Buscar sesión en YouTube"
                size="lg"
              />
            </div>
          )}
        </div>

        {session.tracklist.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold">Tracklist</h2>
            <ol className="glass-card divide-y divide-white/5">
              {session.tracklist.map((track, i) => (
                <li key={i} className="flex gap-4 px-4 py-3 text-sm">
                  <span className="w-6 shrink-0 text-muted-foreground">{i + 1}</span>
                  <span>{track}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <Link
          href="/sesiones"
          className="mt-8 inline-block text-sm text-makina-pink hover:underline"
        >
          ← Volver a sesiones
        </Link>
      </div>
    </article>
  );
}
