"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import { createSupabaseServer } from "@/lib/supabase-server";
import { isSupabaseEnabled } from "@/lib/supabase";

const DEMO_COOKIE = "ufmt_admin";
const ONE_WEEK = 60 * 60 * 24 * 7;

/** Comparação constant-time. Aceita strings de comprimentos diferentes
 *  sem vazar info via timing. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // timingSafeEqual exige mesmo length — equalizamos pra evitar exception
  if (ab.length !== bb.length) {
    // executa mesmo assim com zero-padding pra manter tempo constante
    const padded = Buffer.alloc(ab.length);
    bb.copy(padded);
    timingSafeEqual(ab, padded);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/** Server action usada pelo <form action={loginAction}> */
export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string | null;
  const email = formData.get("email") as string | null;

  if (isSupabaseEnabled) {
    // Em produção: Supabase Auth server-side
    if (!email || !password) redirect("/admin/login?error=campos");
    const supabase = await createSupabaseServer();
    if (!supabase) redirect("/admin/login?error=server");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  } else {
    // Em demo: confere senha
    const expected = process.env.ADMIN_DEMO_PASSWORD ?? "ufmt2024";
    if (!password || !safeEqual(password, expected)) {
      redirect("/admin/login?error=senha");
    }
  }

  // Marca o cookie de admin (em produção o Supabase Auth já gerencia o cookie)
  const c = await cookies();
  if (!isSupabaseEnabled) {
    c.set(DEMO_COOKIE, "demo", { httpOnly: true, sameSite: "lax", path: "/", maxAge: ONE_WEEK });
  }
  redirect("/admin");
}

export async function logoutAction() {
  if (isSupabaseEnabled) {
    const supabase = await createSupabaseServer();
    if (supabase) await supabase.auth.signOut();
  }
  const c = await cookies();
  c.delete(DEMO_COOKIE);
  redirect("/admin/login");
}
