import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabaseConfigured } from "./config";
import { getSupabaseEnv } from "./env";

export async function createClient() {
  assertSupabaseConfigured();
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — ignore
        }
      },
    },
  });
}
