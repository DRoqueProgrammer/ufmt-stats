"use client";
import { loginAction } from "./actions";
import { isSupabaseEnabled } from "@/lib/supabase";

export function LoginForm() {
  return (
    <form action={loginAction} className="space-y-4">
      {isSupabaseEnabled && (
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3.5 py-2.5 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none"
            placeholder="seu@email.com"
          />
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Senha</label>
        <input
          name="password"
          type="password"
          required
          className="w-full px-3.5 py-2.5 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none"
          placeholder={isSupabaseEnabled ? "••••••••" : "Senha de admin (demo)"}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-ink-2 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-ink transition-colors"
      >
        Entrar
      </button>
      {!isSupabaseEnabled && (
        <p className="text-xs text-muted text-center pt-2 border-t border-line">
          <span aria-hidden="true" className="text-accent">*</span>{" "}
          Dica demo: <code className="font-mono text-ink-2 bg-bg px-1.5 py-0.5 rounded">ufmt2024</code>
        </p>
      )}
    </form>
  );
}
