"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnvClient } from "./env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnvClient();
  return createBrowserClient(url, anonKey);
}
