import {
  absoluteUrl,
  buildDigestHtml,
  buildDigestSubject,
  type NewsletterDigest,
} from "@/lib/newsletter/digest";

export type SendDigestResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

export async function sendDigestEmail(
  to: string,
  digest: NewsletterDigest,
  unsubscribeToken: string
): Promise<SendDigestResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY no configurado" };
  }

  const from =
    process.env.NEWSLETTER_FROM_EMAIL?.trim() ||
    "Makina Hub <onboarding@resend.dev>";
  const unsubscribeUrl = absoluteUrl(`/desuscribir?token=${unsubscribeToken}`);
  const html = buildDigestHtml(digest, unsubscribeUrl);
  const subject = buildDigestSubject(digest);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: body.slice(0, 200) || res.statusText };
  }

  return { ok: true };
}
