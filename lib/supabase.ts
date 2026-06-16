/** Flag e env — pode ser importado de qualquer lugar (server ou client). */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const isSupabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
