import { SITE_URL } from "@/lib/constants";

export type DigestEvent = {
  title: string;
  date: string;
  city: string;
  href: string;
};

export type DigestSession = {
  title: string;
  href: string;
};

export type DigestRelease = {
  title: string;
  artist: string;
  href: string;
};

export type NewsletterDigest = {
  siteUrl: string;
  events: DigestEvent[];
  sessions: DigestSession[];
  releases: DigestRelease[];
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function listSection(title: string, items: string): string {
  if (!items) return "";
  return `
    <h2 style="margin:28px 0 12px;font-size:18px;color:#ff2d6a;">${escapeHtml(title)}</h2>
    <ul style="margin:0;padding-left:20px;line-height:1.6;">${items}</ul>
  `;
}

export function buildDigestHtml(digest: NewsletterDigest, unsubscribeUrl: string): string {
  const eventItems = digest.events
    .map(
      (e) =>
        `<li><a href="${escapeHtml(e.href)}" style="color:#e94560;">${escapeHtml(e.title)}</a> — ${escapeHtml(e.date)} · ${escapeHtml(e.city)}</li>`
    )
    .join("");

  const sessionItems = digest.sessions
    .map(
      (s) =>
        `<li><a href="${escapeHtml(s.href)}" style="color:#e94560;">${escapeHtml(s.title)}</a></li>`
    )
    .join("");

  const releaseItems = digest.releases
    .map(
      (r) =>
        `<li><a href="${escapeHtml(r.href)}" style="color:#e94560;">${escapeHtml(r.title)}</a>${r.artist ? ` · ${escapeHtml(r.artist)}` : ""}</li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#0f0f1a;font-family:system-ui,sans-serif;color:#f5f5f5;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#ff2d6a;">Makina Hub</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;">Lo nuevo de la escena mákina</h1>
    <p style="margin:0 0 24px;color:#b8b8c8;line-height:1.5;">Eventos remember, sesiones en YouTube y novedades del catálogo.</p>
    ${listSection("Próximos eventos", eventItems)}
    ${listSection("Sesiones recientes", sessionItems)}
    ${listSection("Novedades", releaseItems)}
    <p style="margin:32px 0 0;">
      <a href="${escapeHtml(digest.siteUrl)}" style="display:inline-block;background:#ff2d6a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Abrir Makina Hub</a>
    </p>
    <p style="margin:32px 0 0;font-size:12px;color:#888;">
      <a href="${escapeHtml(unsubscribeUrl)}" style="color:#888;">Desuscribirme</a>
    </p>
  </div>
</body>
</html>`;
}

export function buildDigestSubject(digest: NewsletterDigest): string {
  const parts: string[] = [];
  if (digest.events.length) parts.push(`${digest.events.length} eventos`);
  if (digest.sessions.length) parts.push(`${digest.sessions.length} sesiones`);
  if (digest.releases.length) parts.push(`${digest.releases.length} novedades`);
  const summary = parts.length ? parts.join(" · ") : "Resumen semanal";
  return `Makina Hub — ${summary}`;
}

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
