"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { isSupabaseEnabled } from "@/lib/supabase";

const DEMO_COOKIE = "ufmt_admin";
const ONE_WEEK = 60 * 60 * 24 * 7;

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
    if (password !== expected) redirect("/admin/login?error=senha");
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
