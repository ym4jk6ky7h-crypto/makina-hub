"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeWatchUrl } from "@/lib/youtube";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement | string,
    config: Record<string, unknown>
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    });
  }
  return apiPromise;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export type YoutubeAudioPlayerProps = {
  videoId: string;
  title: string;
  subtitle?: string;
  artworkUrl?: string | null;
  watchUrl?: string | null;
  anchorId?: string;
  /** Etiqueta corta (p. ej. "Preview" en novedades) */
  badge?: string;
};

export function YoutubeAudioPlayer({
  videoId,
  title,
  subtitle,
  artworkUrl,
  watchUrl,
  anchorId = "reproductor-audio",
  badge,
}: YoutubeAudioPlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerDomId = useId().replace(/:/g, "");
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const tickRef = useRef<number | null>(null);

  const stopTick = useCallback(() => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = window.setInterval(() => {
      const t = playerRef.current?.getCurrentTime();
      if (typeof t === "number") setCurrent(t);
    }, 400);
  }, [stopTick]);

  useEffect(() => {
    let cancelled = false;

    loadYoutubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(mountRef.current, {
        height: "1",
        width: "1",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            setReady(true);
            const d = event.target.getDuration();
            if (Number.isFinite(d) && d > 0) setDuration(d);
          },
          onStateChange: (event: { data: number; target: YTPlayer }) => {
            const YT = window.YT!;
            if (event.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              const d = event.target.getDuration();
              if (Number.isFinite(d) && d > 0) setDuration(d);
              startTick();
            } else {
              setPlaying(false);
              stopTick();
              if (event.data === YT.PlayerState.ENDED) setCurrent(0);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      stopTick();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, startTick, stopTick]);

  const toggle = () => {
    if (!playerRef.current || !ready) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCurrent(value);
    playerRef.current?.seekTo(value, true);
  };

  const href = watchUrl ?? youtubeWatchUrl(videoId);
  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      id={anchorId}
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-gradient-to-br from-makina-purple/15 via-card/80 to-makina-pink/10 p-4 sm:p-5"
    >
      <div className="sr-only" aria-hidden ref={mountRef} id={playerDomId} />

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-20 sm:w-20">
          {artworkUrl ? (
            <Image src={artworkUrl} alt="" fill className="object-cover" sizes="80px" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-makina-pink/30 to-makina-purple/30">
              <Play className="h-8 w-8 text-makina-pink" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {badge && (
              <span className="rounded-full bg-makina-cyan/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-makina-cyan">
                {badge}
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
          disabled={!ready}
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-makina-pink text-white shadow-lg",
            "transition-transform hover:scale-105 disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:scale-100"
          )}
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {playing ? (
            <Pause className="h-5 w-5 fill-white" />
          ) : (
            <Play className="h-5 w-5 fill-white" />
          )}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
          {formatTime(current)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={1}
          value={Math.min(current, duration || 0)}
          onChange={onSeek}
          disabled={!ready || duration <= 0}
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

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-makina-pink"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Abrir fuente
        </a>
      )}
    </div>
  );
}

export type StickyAudioPlayerProps = {
  videoId: string;
  title: string;
  subtitle?: string;
  watchUrl?: string | null;
  anchorId?: string;
};

export function StickyAudioPlayer({
  videoId,
  title,
  subtitle,
  watchUrl,
  anchorId = "reproductor-audio",
}: StickyAudioPlayerProps) {
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { threshold: 0.2, rootMargin: "-8px 0px 0px 0px" }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [videoId, anchorId]);

  if (!pinned || dismissed) return null;

  const href = watchUrl ?? youtubeWatchUrl(videoId);

  return (
    <div
      className="fixed left-0 right-0 z-[60] border-t border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl bottom-16 lg:bottom-0 motion-reduce:transition-none"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label={`Reproduciendo: ${title}`}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <Link
          href={`#${anchorId}`}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-makina-pink hover:underline"
        >
          Ver reproductor
        </Link>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-white/5"
          aria-label="Abrir fuente"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-white/5"
          aria-label="Ocultar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
