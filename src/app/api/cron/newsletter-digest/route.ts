import { NextResponse } from "next/server";
import { fetchNewsletterDigest, isDigestEmpty } from "@/lib/newsletter/fetch-digest";
import { sendDigestEmail } from "@/lib/newsletter/send-digest";
import { listActiveSubscribers } from "@/lib/newsletter/subscribers";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET no configurado" },
      { status: 500 }
    );
  }

  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY no configurado" },
      { status: 500 }
    );
  }

  try {
    const digest = await fetchNewsletterDigest();
    if (isDigestEmpty(digest)) {
      return NextResponse.json({ ok: true, skipped: true, reason: "empty_digest" });
    }

    const subscribers = await listActiveSubscribers();
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      const result = await sendDigestEmail(sub.email, digest, sub.unsubscribe_token);
      if (result.ok) sent++;
      else {
        failed++;
        if (errors.length < 5) errors.push(`${sub.email}: ${result.error}`);
      }
    }

    return NextResponse.json({
      ok: failed === 0,
      sent,
      failed,
      subscribers: subscribers.length,
      errors: errors.length ? errors : undefined,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
