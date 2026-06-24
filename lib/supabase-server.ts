import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseEnabled } from "./supabase";

/** Cliente para Server Components / Route Handlers / Server Actions */
export async function createSupabaseServer() {
  if (!isSupabaseEnabled) return null;
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (e) {
          // @supabase/ssr docs reconhecem que `cookies().set` lança em
          // Server Components (read-only). Logamos pra não esconder bugs
          // reais de cookie store em Route Handlers / Server Actions.
          console.error("[supabase] cookie set failed:", (e as Error).message);
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (e) {
          console.error("[supabase] cookie remove failed:", (e as Error).message);
        }
      },
    },
  });
}
