/**
 * Supabase client factory — implement when connecting to live database.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return {
    url,
    anonKey,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

/** Placeholder — replace with createBrowserClient / createServerClient from @supabase/ssr */
export function createSupabaseClient(): never {
  throw new Error(
    "Supabase client not configured. Install @supabase/supabase-js and set environment variables."
  );
}
