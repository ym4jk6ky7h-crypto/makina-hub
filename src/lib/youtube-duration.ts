import {
  MAX_TRACK_SECONDS,
  MIN_SESSION_SECONDS,
  MIN_TRACK_SECONDS,
} from "@/lib/media-constants";

export function parseIso8601Duration(iso: string): number | null {
  const m = iso.match(
    /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
  );
  if (!m) return null;
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const s = Number(m[3] ?? 0);
  return h * 3600 + min * 60 + s;
}

export function secondsToMinutes(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

export function isValidSessionDuration(seconds: number | null | undefined): boolean {
  return typeof seconds === "number" && seconds >= MIN_SESSION_SECONDS;
}

export function isValidTrackDuration(seconds: number | null | undefined): boolean {
  return (
    typeof seconds === "number" &&
    seconds >= MIN_TRACK_SECONDS &&
    seconds <= MAX_TRACK_SECONDS
  );
}
