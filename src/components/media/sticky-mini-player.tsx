"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

type StickyMiniPlayerProps = {
  videoId: string;
  title: string;
  watchUrl?: string | null;
  subtitle?: string;
  className?: string;
};

export function StickyMiniPlayer({
  videoId,
  title,
  watchUrl,
  subtitle,
  className,
}: StickyMiniPlayerProps) {
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("reproductor");
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-8px 0px 0px 0px" }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [videoId]);

  if (!pinned || dismissed) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-[60] border-t border-white/10 bg-background/95 shadow-2xl shadow-black/50 backdrop-blur-xl",
        "bottom-16 lg:bottom-0",
        className
      )}
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label={`Reproduciendo: ${title}`}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3">
        <div className="relative hidden h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-black sm:block">
          <iframe
            src={youtubeEmbedUrl(videoId)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {watchUrl && (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label="Abrir en YouTube"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Link
            href="#reproductor"
            className="hidden rounded-lg px-2 py-1 text-xs font-medium text-makina-pink hover:underline sm:inline"
          >
            Ver vídeo
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Ocultar reproductor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="relative aspect-video w-full bg-black sm:hidden">
        <iframe
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
