"use client";

import Link from "next/link";
import { Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSessionPlay } from "@/lib/session-play";
import type { Session } from "@/types/database";

type ArtistListenNowProps = {
  artistName: string;
  sessions: Session[];
  inlinePlayer?: boolean;
};

export function ArtistListenNow({
  artistName,
  sessions,
  inlinePlayer = false,
}: ArtistListenNowProps) {
  const playable = sessions
    .filter((s) => resolveSessionPlay(s).videoId)
    .slice(0, 3);

  if (playable.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-makina-pink/20 bg-gradient-to-br from-makina-pink/10 via-transparent to-makina-purple/10 p-5">
      <h2 className="mb-4 text-lg font-bold">Escuchar ahora</h2>
      <ul className="space-y-3">
        {playable.map((session) => (
          <li
            key={session.id}
            className="flex items-center gap-3 rounded-xl bg-black/25 p-3"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-makina-purple/30 to-red-900/30">
              <Headphones className="h-6 w-6 text-makina-purple" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/sesiones/${session.slug}${inlinePlayer ? "#reproductor" : ""}`}
                className="font-semibold hover:text-makina-pink"
              >
                {session.title}
              </Link>
              <p className="text-xs text-muted-foreground">{artistName} · Sesión</p>
            </div>
            <Link
              href={`/sesiones/${session.slug}#reproductor`}
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600",
                "text-white shadow-lg shadow-red-900/30 transition-transform hover:scale-105"
              )}
              aria-label="Ver sesión"
            >
              <Headphones className="h-5 w-5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
