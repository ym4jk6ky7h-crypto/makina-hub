"use client";

import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ShareButtonProps = {
  title: string;
  path: string;
  compact?: boolean;
  label?: string;
};

export function ShareButton({
  title,
  path,
  compact = false,
  label = "Compartir",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : `${SITE_URL}${path}`;
  const text = `${title} — Makina Hub`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    void copyLink();
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;

  return (
    <div
      className={cn("flex flex-wrap gap-2", compact ? "mt-0" : "mt-4")}
      role="group"
      aria-label="Compartir"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 border-white/15"
        onClick={() => void nativeShare()}
      >
        <Share2 className="h-4 w-4" />
        {label}
      </Button>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-green-600/30"
        >
          <MessageCircle className="h-4 w-4 text-green-500" />
          WhatsApp
        </Button>
      </a>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground"
        onClick={() => void copyLink()}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {copied ? "Copiado" : "Copiar enlace"}
      </Button>
    </div>
  );
}
