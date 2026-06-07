"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MusicQueueItem } from "@/lib/music-player-types";
import { loadYoutubeApi, type YTPlayer } from "@/lib/youtube-player-api";

type MusicPlayerContextValue = {
  current: MusicQueueItem | null;
  queue: MusicQueueItem[];
  playing: boolean;
  ready: boolean;
  currentTime: number;
  duration: number;
  playTrack: (track: MusicQueueItem, queue?: MusicQueueItem[]) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  clear: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytMountRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const tickRef = useRef<number | null>(null);

  const [current, setCurrent] = useState<MusicQueueItem | null>(null);
  const [queue, setQueue] = useState<MusicQueueItem[]>([]);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const stopTick = useCallback(() => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTick = useCallback(
    (getTime: () => number) => {
      stopTick();
      tickRef.current = window.setInterval(() => {
        const t = getTime();
        if (Number.isFinite(t)) setCurrentTime(t);
      }, 400);
    },
    [stopTick]
  );

  const destroyYoutube = useCallback(() => {
    stopTick();
    ytPlayerRef.current?.destroy();
    ytPlayerRef.current = null;
  }, [stopTick]);

  const playTrack = useCallback((track: MusicQueueItem, nextQueue?: MusicQueueItem[]) => {
    setCurrent(track);
    setQueue(nextQueue?.length ? nextQueue : [track]);
    setPlaying(true);
    setReady(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    ytPlayerRef.current?.pauseVideo();
    setPlaying(false);
    stopTick();
  }, [stopTick]);

  const toggle = useCallback(() => {
    if (!current) return;
    if (current.audioUrl) {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) void audio.play().catch(() => setPlaying(false));
      else audio.pause();
    } else if (current.videoId && ytPlayerRef.current) {
      if (playing) ytPlayerRef.current.pauseVideo();
      else ytPlayerRef.current.playVideo();
    }
  }, [current, playing]);

  const next = useCallback(() => {
    if (!current || queue.length < 2) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    playTrack(queue[(idx + 1) % queue.length], queue);
  }, [current, queue, playTrack]);

  const prev = useCallback(() => {
    if (!current || queue.length < 2) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    playTrack(queue[(idx - 1 + queue.length) % queue.length], queue);
  }, [current, queue, playTrack]);

  const seek = useCallback(
    (seconds: number) => {
      if (current?.audioUrl && audioRef.current) {
        audioRef.current.currentTime = seconds;
        setCurrentTime(seconds);
      } else if (current?.videoId && ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(seconds, true);
        setCurrentTime(seconds);
      }
    },
    [current]
  );

  const clear = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.src = "";
    destroyYoutube();
    setCurrent(null);
    setQueue([]);
    setPlaying(false);
    setReady(false);
    setCurrentTime(0);
    setDuration(0);
  }, [destroyYoutube]);

  // Native HTML5 audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current?.audioUrl) return;

    destroyYoutube();
    setReady(false);
    setCurrentTime(0);
    setDuration(0);
    audio.src = current.audioUrl;
    audio.load();

    if (playing) void audio.play().catch(() => setPlaying(false));
  }, [current?.id, current?.audioUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current?.audioUrl) return;

    const onPlay = () => {
      setPlaying(true);
      startTick(() => audio.currentTime);
    };
    const onPause = () => {
      setPlaying(false);
      stopTick();
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setReady(true);
    };
    const onEnded = () => next();

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [current?.id, current?.audioUrl, next, startTick, stopTick]);

  // YouTube (temas completos verificados)
  useEffect(() => {
    if (!current?.videoId || current.audioUrl) return;

    let cancelled = false;
    const videoId = current.videoId;

    loadYoutubeApi().then(() => {
      if (cancelled || !ytMountRef.current || !window.YT) return;

      destroyYoutube();

      ytPlayerRef.current = new window.YT!.Player(ytMountRef.current, {
        height: "1",
        width: "1",
        videoId,
        playerVars: {
          autoplay: playing ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            if (cancelled) return;
            setReady(true);
            const d = event.target.getDuration();
            if (Number.isFinite(d) && d > 0) setDuration(d);
            if (playing) event.target.playVideo();
          },
          onStateChange: (event: { data: number; target: YTPlayer }) => {
            const YT = window.YT!;
            if (event.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              const d = event.target.getDuration();
              if (Number.isFinite(d) && d > 0) setDuration(d);
              startTick(() => event.target.getCurrentTime());
            } else {
              setPlaying(false);
              stopTick();
              if (event.data === YT.PlayerState.ENDED) next();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      destroyYoutube();
    };
  }, [current?.id, current?.videoId, current?.audioUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!current?.audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && audio.paused) void audio.play().catch(() => setPlaying(false));
    if (!playing && !audio.paused) audio.pause();
  }, [playing, current?.audioUrl]);

  const value = useMemo(
    () => ({
      current,
      queue,
      playing,
      ready,
      currentTime,
      duration,
      playTrack,
      toggle,
      pause,
      next,
      prev,
      seek,
      clear,
    }),
    [
      current,
      queue,
      playing,
      ready,
      currentTime,
      duration,
      playTrack,
      toggle,
      pause,
      next,
      prev,
      seek,
      clear,
    ]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" className="hidden" aria-hidden />
      <div ref={ytMountRef} className="sr-only" aria-hidden />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer debe usarse dentro de MusicPlayerProvider");
  }
  return ctx;
}

export function useMusicPlayerOptional() {
  return useContext(MusicPlayerContext);
}
