import { createClient } from "@supabase/supabase-js";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseServerClient() {
  const url = getEnv("SUPABASE_URL");
  const key = getEnv("SUPABASE_KEY");

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseAdminClient() {
  const url = getEnv("SUPABASE_URL");
  // Try to use the service role key, fallback to standard key if not set
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || getEnv("SUPABASE_KEY");

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
