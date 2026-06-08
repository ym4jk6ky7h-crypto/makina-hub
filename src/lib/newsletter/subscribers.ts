import { createUnsubscribeToken } from "@/lib/newsletter/unsubscribe-token";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActiveSubscriber = {
  id: string;
  email: string;
  unsubscribe_token: string;
};

export async function listActiveSubscribers(limit?: number): Promise<ActiveSubscriber[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("newsletter_subscribers")
    .select("id, email, unsubscribe_token")
    .is("unsubscribed_at", null)
    .order("subscribed_at", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const missingToken = rows.filter((r) => !r.unsubscribe_token);

  for (const row of missingToken) {
    const token = createUnsubscribeToken();
    await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribe_token: token })
      .eq("id", row.id);
    row.unsubscribe_token = token;
  }

  return rows.filter((r) => r.unsubscribe_token) as ActiveSubscriber[];
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}
