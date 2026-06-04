import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ExternalLink, Headphones } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
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

  return (
    <article className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="glass-card p-8">
          <Headphones className="mb-4 h-10 w-10 text-makina-purple" />
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
          {session.youtube_url && (
            <a
              href={session.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400"
            >
              <ExternalLink className="h-4 w-4" />
              Ver sesión en YouTube
            </a>
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
