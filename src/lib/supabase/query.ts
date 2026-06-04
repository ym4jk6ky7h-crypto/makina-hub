import { formatSupabaseError } from "./config";

type SupabaseResult<T> = { data: T | null; error: { message?: string; code?: string; details?: string } | null };

export function unwrapSupabase<T>(result: SupabaseResult<T>, context: string): T {
  if (result.error) {
    const detail = formatSupabaseError(result.error);
    throw new Error(`${context}: ${detail}`);
  }
  return result.data as T;
}
