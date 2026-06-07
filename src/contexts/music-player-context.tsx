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
  const [current, setCurrent] = useState<MusicQueueItem | null>(null);
  const [queue, setQueue] = useState<MusicQueueItem[]>([]);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = useCallback((track: MusicQueueItem, nextQueue?: MusicQueueItem[]) => {
    setCurrent(track);
    setQueue(nextQueue?.length ? nextQueue : [track]);
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [current]);

  const next = useCallback(() => {
    if (!current || queue.length < 2) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const nextTrack = queue[(idx + 1) % queue.length];
    setCurrent(nextTrack);
    setPlaying(true);
  }, [current, queue]);

  const prev = useCallback(() => {
    if (!current || queue.length < 2) return;
    const idx = queue.findIndex((t) => t.id === current.id);
    const prevTrack = queue[(idx - 1 + queue.length) % queue.length];
    setCurrent(prevTrack);
    setPlaying(true);
  }, [current, queue]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const clear = useCallback(() => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) audio.src = "";
    setCurrent(null);
    setQueue([]);
    setPlaying(false);
    setReady(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;

    setReady(false);
    setCurrentTime(0);
    setDuration(0);
    audio.src = current.audioUrl;
    audio.load();

    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    }
  }, [current?.id, current?.audioUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setReady(true);
    };
    const onEnded = () => {
      if (queue.length > 1 && current) {
        const idx = queue.findIndex((t) => t.id === current.id);
        const nextTrack = queue[(idx + 1) % queue.length];
        setCurrent(nextTrack);
        setPlaying(true);
      } else {
        setPlaying(false);
        setCurrentTime(0);
      }
    };

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
  }, [current, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (playing && audio.paused) void audio.play().catch(() => setPlaying(false));
    if (!playing && !audio.paused) audio.pause();
  }, [playing, current]);

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
