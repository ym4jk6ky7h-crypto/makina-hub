"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  dismissInstallPrompt,
  isInstallDismissed,
  isIosSafari,
  isStandaloneMode,
} from "@/lib/pwa/install-utils";

export function InstallAppBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || isInstallDismissed()) return;

    const onPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferred(event);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);

    if (isIosSafari()) {
      const timer = window.setTimeout(() => setShowIosHint(true), 4000);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", onPrompt);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const close = () => {
    dismissInstallPrompt();
    setVisible(false);
    setShowIosHint(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    close();
  };

  if (isStandaloneMode()) return null;

  if (visible && deferred) {
    return (
      <div
        role="dialog"
        aria-label="Instalar Makina Hub"
        className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl border border-white/10 bg-card/95 p-4 shadow-2xl backdrop-blur-md lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-sm"
      >
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-makina-pink to-makina-purple text-sm font-bold text-white">
            MH
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Instalar Makina Hub</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Acceso rápido a artistas, eventos y favoritos desde tu pantalla de inicio.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" className="btn-makina gap-1.5" onClick={install}>
                <Download className="h-4 w-4" />
                Instalar
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={close}>
                Ahora no
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (showIosHint && !isInstallDismissed()) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl border border-white/10 bg-card/95 p-4 shadow-2xl backdrop-blur-md lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-sm">
        <div className="flex gap-3">
          <Share className="mt-0.5 h-5 w-5 shrink-0 text-makina-cyan" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Añadir a inicio</p>
            <p className="mt-1 text-sm text-muted-foreground">
              En Safari: pulsa Compartir y elige «Añadir a pantalla de inicio».
            </p>
            <Button type="button" size="sm" variant="ghost" className="mt-2" onClick={close}>
              Entendido
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
