import Link from "next/link";
import { logoutAction } from "../(auth)/login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-bg-alt text-ink-2 sticky top-0 z-10 shadow-md border-b border-line">
        <div className="container mx-auto px-6 max-w-[1200px] flex items-center justify-between py-4">
          <Link href="/admin" className="flex items-center gap-3 no-underline text-ink-2">
            <span
              className="w-9 h-9 rounded-[10px] grid place-items-center font-serif text-base font-semibold"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "var(--bg)" }}
            >Σ</span>
            <span>
              <strong className="block text-sm font-semibold text-ink-2">Painel Admin</strong>
              <small className="block text-[11px] text-muted-2">UFMT · Cálculo I &amp; VGA</small>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/admin" className="px-3 py-1.5 text-sm text-ink-2 hover:text-accent rounded transition-colors">Visão geral</Link>
            <Link href="/admin/notas" className="px-3 py-1.5 text-sm text-ink-2 hover:text-accent rounded transition-colors">Notas</Link>
            <Link href="/admin/turmas" className="px-3 py-1.5 text-sm text-ink-2 hover:text-accent rounded transition-colors">Turmas</Link>
            <Link href="/admin/importar" className="px-3 py-1.5 text-sm text-ink-2 hover:text-accent rounded transition-colors">Importar CSV</Link>
            <a href="/" target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm text-ink-2 hover:text-accent rounded transition-colors">Ver site ↗</a>
            <form action={logoutAction}>
              <button type="submit" className="ml-2 px-3 py-1.5 text-sm border border-line-2 hover:border-accent text-ink-2 hover:text-accent rounded transition-colors">Sair</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
