import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseOk = isSupabaseConfigured();
  const cronConfigured = Boolean(process.env.CRON_SECRET?.trim());
  const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
  const newsletterFromConfigured = Boolean(process.env.NEWSLETTER_FROM_EMAIL?.trim());

  return NextResponse.json({
    ok: supabaseOk,
    service: "makina-hub",
    checks: {
      supabase: supabaseOk ? "ok" : "missing_env",
      cronSecret: cronConfigured ? "ok" : "missing_env",
      resendApiKey: resendConfigured ? "ok" : "missing_env",
      newsletterFrom: newsletterFromConfigured ? "ok" : "optional",
    },
    timestamp: new Date().toISOString(),
  });
}
