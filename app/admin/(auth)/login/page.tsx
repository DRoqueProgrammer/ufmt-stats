import { redirect } from "next/navigation";
import { isSupabaseEnabled } from "@/lib/supabase";
import { isAdminFromCookies } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdminFromCookies()) redirect("/admin");

  const params = await searchParams;
  const errorMsg = decodeError(params.error);

  return (
    <main className="min-h-screen grid place-items-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center gap-3 no-underline">
            <span
              className="w-10 h-10 rounded-[10px] grid place-items-center text-white font-serif text-lg font-semibold"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-2))" }}
            >Σ</span>
            <span className="font-sans font-bold text-base tracking-wider text-ink">Painel Admin · UFMT</span>
          </a>
        </div>
        <div className="bg-white border border-line rounded-[14px] p-8 shadow-md">
          <h1 className="font-serif text-2xl font-semibold text-ink-2 mb-1">Entrar</h1>
          <p className="text-muted text-sm mb-6">
            {isSupabaseEnabled
              ? "Use sua conta do Supabase para acessar o painel."
              : "Modo demo — use a senha definida em ADMIN_DEMO_PASSWORD (padrão: ufmt2024)."}
          </p>
          {errorMsg && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
              {errorMsg}
            </p>
          )}
          <LoginForm />
        </div>
        <p className="text-center text-xs text-muted-2 mt-6">
          <a href="/" className="hover:text-accent">← voltar para a página pública</a>
        </p>
      </div>
    </main>
  );
}

function decodeError(code?: string): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    campos: "Preencha e-mail e senha.",
    server: "Erro no servidor.",
    senha: "Senha incorreta.",
  };
  return map[code] ?? code;
}
