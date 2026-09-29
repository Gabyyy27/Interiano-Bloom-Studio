import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente exclusivo para datos públicos.
 *
 * No usa cookies, sesiones ni autenticación SSR.
 * Está pensado únicamente para consultas públicas
 * protegidas por las políticas RLS de Supabase.
 */
export function createPublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Faltan las variables públicas de Supabase.",
    );
  }

  return createSupabaseClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}