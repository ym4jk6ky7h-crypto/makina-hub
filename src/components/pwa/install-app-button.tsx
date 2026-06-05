"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  dismissInstallPrompt,
  isIosSafari,
  isStandaloneMode,
} from "@/lib/pwa/install-utils";

export function InstallAppButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (isStandaloneMode()) return;

    const onPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferred(event);
      setHidden(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    if (isIosSafari()) setHidden(false);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (hidden || isStandaloneMode()) return null;

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt();
      dismissInstallPrompt();
      setHidden(true);
      return;
    }

    if (isIosSafari()) {
      alert("En Safari: pulsa Compartir → «Añadir a pantalla de inicio».");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5 border-white/10 bg-white/5 text-xs"
      onClick={onClick}
    >
      {deferred ? <Download className="h-3.5 w-3.5" /> : <Share className="h-3.5 w-3.5" />}
      Instalar app
    </Button>
  );
}
