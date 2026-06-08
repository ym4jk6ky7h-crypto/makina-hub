import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Headphones } from "lucide-react";
import { DetailSaveShare } from "@/components/favorites/detail-save-share";
import { DetailPlayerSection } from "@/components/media/detail-player-section";
import { PlayYoutubeButton } from "@/components/ui/play-youtube-button";
import { favoriteFromSession } from "@/lib/favorites/build-item";
import { buildMetadata } from "@/lib/seo/metadata";
import { resolveSessionPlay } from "@/lib/session-play";
import { formatYoutubeDuration } from "@/lib/format-duration";
import { getSessionThumbnail } from "@/lib/session-thumbnail";
import { preferUnoptimizedImage } from "@/lib/images/external-image-props";
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

  const { videoId, youtubeHref, watchUrl, isSearch, durationSeconds } =
    resolveSessionPlay(session);
  const { url: thumb, fromYoutube } = getSessionThumbnail(session);

  return (
    <article>
      <section className="detail-hero-glow relative overflow-hidden border-b border-makina-purple/20">
        {thumb && (
          <div className="absolute inset-0">
            <Image
              src={thumb}
              alt=""
              fill
              className="scale-110 object-cover opacity-20 blur-3xl"
              sizes="100vw"
              priority
              unoptimized={!fromYoutube}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/95 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,92,246,0.15),transparent)]" />

        <div className="relative mx-auto max-w-4xl px-4 py-10 lg:px-8 lg:py-12">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-makina-purple lg:text-left">
            Sesión YouTube
          </p>
          <h1 className="mt-2 text-center font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-left">
            {session.title}
          </h1>
          {session.artist && (
            <Link
              href={`/artistas/${session.artist.slug}`}
              className="mt-3 block text-center text-lg text-makina-pink hover:underline lg:text-left"
            >
              {session.artist.name}
            </Link>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
            <span>{formatDate(session.created_at)}</span>
            {durationSeconds != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatYoutubeDuration(durationSeconds)}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/50 shadow-xl">
          {videoId ? (
            <DetailPlayerSection
              videoId={videoId}
              title={session.title}
              watchUrl={watchUrl ?? youtubeHref}
              subtitle={session.artist?.name ?? "Sesión"}
            />
          ) : thumb ? (
            <div className="relative aspect-video w-full bg-secondary">
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
                sizes="(max-width: 768px) 100vw, 896px"
                priority
                unoptimized={preferUnoptimizedImage(thumb)}
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-makina-purple/10">
              <Headphones className="h-16 w-16 text-makina-purple/50" />
            </div>
          )}

          <div className="border-t border-white/10 p-6 sm:p-8">
            {!videoId && youtubeHref && (
              <div className="mb-6 space-y-2">
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
            <DetailSaveShare
              item={favoriteFromSession(session)}
              shareTitle={session.title}
              sharePath={`/sesiones/${session.slug}`}
            />
          </div>
        </div>

        {session.tracklist.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-xl font-bold">Tracklist</h2>
            <ol className="glass-card divide-y divide-white/5">
              {session.tracklist.map((track, i) => (
                <li key={i} className="flex gap-4 px-4 py-3 text-sm">
                  <span className="w-6 shrink-0 font-mono text-muted-foreground">{i + 1}</span>
                  <span>{track}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <Link
          href="/sesiones"
          className="mt-10 inline-block text-sm font-medium text-makina-purple hover:underline"
        >
          ← Volver a sesiones
        </Link>
      </div>
    </article>
  );
}
