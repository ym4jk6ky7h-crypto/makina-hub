"use client";

import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ShareEventButtonProps = {
  title: string;
  slug: string;
  compact?: boolean;
};

export function ShareEventButton({
  title,
  slug,
  compact = false,
}: ShareEventButtonProps) {
  const [copied, setCopied] = useState(false);
  const path = `/eventos/${slug}`;
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
        /* user cancelled */
      }
    }
    void copyLink();
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;

  return (
    <div
      className={cn("flex flex-wrap gap-2", compact ? "mt-0" : "mt-4")}
      role="group"
      aria-label="Compartir evento"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 border-green-600/30 bg-green-600/5 hover:bg-green-600/10"
        onClick={() => void nativeShare()}
      >
        <Share2 className="h-4 w-4" />
        Compartir
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
