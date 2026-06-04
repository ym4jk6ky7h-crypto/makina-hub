import { NextResponse } from "next/server";
import { spawn } from "child_process";
import * as path from "path";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

function runDailySync(): Promise<{ code: number; output: string }> {
  const root = path.join(process.cwd());
  const tsx = path.join(root, "node_modules", ".bin", "tsx");
  const script = path.join(root, "scripts", "daily-sync.ts");

  return new Promise((resolve) => {
    const chunks: string[] = [];
    const child = spawn(tsx, [script, "--quick"], {
      cwd: root,
      env: process.env,
      shell: false,
    });
    child.stdout?.on("data", (d) => chunks.push(String(d)));
    child.stderr?.on("data", (d) => chunks.push(String(d)));
    child.on("close", (code) => resolve({ code: code ?? 1, output: chunks.join("") }));
  });
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET no configurado en el servidor" },
      { status: 500 }
    );
  }

  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, output } = await runDailySync();
    return NextResponse.json({
      ok: code === 0,
      exitCode: code,
      tail: output.slice(-4000),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
