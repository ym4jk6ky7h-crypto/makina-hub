import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseOk = isSupabaseConfigured();
  const cronConfigured = Boolean(process.env.CRON_SECRET?.trim());

  return NextResponse.json({
    ok: supabaseOk,
    service: "makina-hub",
    checks: {
      supabase: supabaseOk ? "ok" : "missing_env",
      cronSecret: cronConfigured ? "ok" : "missing_env",
    },
    timestamp: new Date().toISOString(),
  });
}
