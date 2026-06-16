import Link from "next/link";
import { logoutAction } from "../(auth)/login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-ink-2 text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-6 max-w-[1200px] flex items-center justify-between py-4">
          <Link href="/admin" className="flex items-center gap-3 no-underline text-white">
            <span className="w-9 h-9 rounded-[10px] grid place-items-center font-serif text-base font-semibold" style={{ background: "linear-gradient(135deg, #ff6b3d, #ff8c66)" }}>Σ</span>
            <span>
              <strong className="block text-sm font-semibold">Painel Admin</strong>
              <small className="block text-[11px] text-[#8c9bb6]">UFMT · Cálculo I &amp; VGA</small>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/admin" className="px-3 py-1.5 text-sm text-white hover:text-accent-2 rounded transition-colors">Visão geral</Link>
            <Link href="/admin/notas" className="px-3 py-1.5 text-sm text-white hover:text-accent-2 rounded transition-colors">Notas</Link>
            <Link href="/admin/turmas" className="px-3 py-1.5 text-sm text-white hover:text-accent-2 rounded transition-colors">Turmas</Link>
            <Link href="/admin/importar" className="px-3 py-1.5 text-sm text-white hover:text-accent-2 rounded transition-colors">Importar CSV</Link>
            <a href="/" target="_blank" className="px-3 py-1.5 text-sm text-white hover:text-accent-2 rounded transition-colors">Ver site ↗</a>
            <form action={logoutAction}>
              <button type="submit" className="ml-2 px-3 py-1.5 text-sm border border-[#3a4b6b] hover:border-accent text-[#c8d3e6] hover:text-accent-2 rounded transition-colors">Sair</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
