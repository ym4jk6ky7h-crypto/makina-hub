"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ExternalLink,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { useMusicPlayer } from "@/contexts/music-player-context";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function GlobalAudioBar() {
  const {
    current,
    queue,
    playing,
    ready,
    currentTime,
    duration,
    toggle,
    next,
    prev,
    seek,
    clear,
  } = useMusicPlayer();

  if (!current) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasQueue = queue.length > 1;

  return (
    <div
      className="fixed left-0 right-0 z-[60] border-t border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl bottom-16 lg:bottom-0"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label={`Reproduciendo: ${current.title}`}
    >
      <div className="mx-auto max-w-5xl px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-3">
          <Link
            href={current.href}
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-12 sm:w-12"
          >
            {current.artworkUrl ? (
              <Image
                src={current.artworkUrl}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-makina-pink/30 to-makina-purple/30">
                <Play className="h-5 w-5 text-makina-pink" />
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={current.href}
              className="block truncate text-sm font-semibold hover:text-makina-pink"
            >
              {current.title}
            </Link>
            {current.subtitle && (
              <p className="truncate text-xs text-muted-foreground">
                {current.subtitle}
                {current.isPreview ? " · Preview" : ""}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            {hasQueue && (
              <button
                type="button"
                onClick={prev}
                className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="Anterior"
              >
                <SkipBack className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={toggle}
              disabled={!ready}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full bg-makina-pink text-white",
                "shadow-lg shadow-makina-pink/30 transition-transform hover:scale-105 disabled:opacity-50"
              )}
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-white" />
              ) : (
                <Play className="h-4 w-4 fill-white" />
              )}
            </button>
            {hasQueue && (
              <button
                type="button"
                onClick={next}
                className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="Siguiente"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            )}
          </div>

          {current.downloadUrl && (
            <a
              href={current.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-makina-cyan sm:block"
              aria-label="Descargar o comprar"
            >
              <Download className="h-4 w-4" />
            </a>
          )}

          <button
            type="button"
            onClick={clear}
            className="rounded-lg p-2 text-muted-foreground hover:bg-white/5"
            aria-label="Cerrar reproductor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2 sm:mt-2.5">
          <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground sm:text-xs">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!ready || duration <= 0}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-makina-pink disabled:opacity-40"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, rgba(255,255,255,0.15) ${progress}%)`,
            }}
            aria-label="Progreso"
          />
          <span className="w-9 shrink-0 text-[10px] tabular-nums text-muted-foreground sm:text-xs">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NativeAudioPlayer({
  title,
  subtitle,
  artworkUrl,
  downloadUrl,
  isPreview,
  anchorId = "reproductor-audio",
}: {
  title: string;
  subtitle?: string;
  artworkUrl?: string | null;
  downloadUrl?: string | null;
  isPreview?: boolean;
  anchorId?: string;
}) {
  const { current, playing, ready, currentTime, duration, toggle, seek } =
    useMusicPlayer();

  if (!current) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isActive = current.title === title;

  return (
    <div
      id={anchorId}
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-gradient-to-br from-makina-purple/15 via-card/80 to-makina-pink/10 p-4 sm:p-5"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-20 sm:w-20">
          {artworkUrl ? (
            <Image
              src={artworkUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-makina-pink/30 to-makina-purple/30">
              <Play className="h-8 w-8 text-makina-pink" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isPreview && (
              <span className="rounded-full bg-makina-cyan/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-makina-cyan">
                Preview
              </span>
            )}
            <p className="truncate font-semibold">{title}</p>
          </div>
          {subtitle && (
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={!ready || !isActive}
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-makina-pink text-white shadow-lg",
            "transition-transform hover:scale-105 disabled:opacity-50"
          )}
          aria-label={playing && isActive ? "Pausar" : "Reproducir"}
        >
          {playing && isActive ? (
            <Pause className="h-5 w-5 fill-white" />
          ) : (
            <Play className="h-5 w-5 fill-white" />
          )}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.5}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          disabled={!ready || duration <= 0 || !isActive}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-makina-pink disabled:opacity-40"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, rgba(255,255,255,0.15) ${progress}%)`,
          }}
          aria-label="Progreso"
        />
        <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
          {formatTime(duration)}
        </span>
      </div>

      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-makina-cyan"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Descargar o comprar original
        </a>
      )}
    </div>
  );
}
