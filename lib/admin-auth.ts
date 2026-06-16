import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseEnabled } from "./supabase";
import { createSupabaseServer } from "./supabase-server";

const DEMO_COOKIE = "ufmt_admin";

/** Verifica se o usuário atual é admin. Suporta dois modos:
 *  1. Supabase Auth (produção) — checa sessão via cookie
 *  2. Demo (sem Supabase) — checa cookie de demo com senha
 */
export async function isAdminFromCookies(): Promise<boolean> {
  if (isSupabaseEnabled) {
    const supabase = await createSupabaseServer();
    if (!supabase) return false;
    const { data } = await supabase.auth.getUser();
    return !!data.user;
  }
  const c = await cookies();
  return c.get(DEMO_COOKIE)?.value === "demo";
}

/** Server-side guard para páginas /admin/* */
export async function requireAdmin() {
  const ok = await isAdminFromCookies();
  if (!ok) redirect("/admin/login");
}
