import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

// Lazy-initialized service role client — server-side only, never exposed to browser
export function getDb(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  _client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}

// Convenience alias
export const db = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getDb();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
