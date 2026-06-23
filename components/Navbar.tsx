"use client";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["#introducao", "Introdução"],
    ["#metodologia", "Metodologia"],
    ["#estatisticas", "Estatísticas"],
    ["#distribuicao", "Distribuição"],
    ["#aprovacao", "Aprovação"],
    ["#status", "Status"],
    ["#conclusao", "Conclusão"],
    ["#autores", "Autores"],
  ];

  return (
    <header
      className={`sticky z-50 backdrop-blur transition-colors ${
        scrolled ? "bg-bg-alt/85 border-b border-line" : "bg-transparent"
      }`}
      style={{ top: scrolled ? 0 : 24, paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="container mx-auto px-6 max-w-[1200px] flex items-center justify-between py-3.5">
        <a href="#hero" className="flex items-center gap-3 no-underline">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-[10px] grid place-items-center text-bg font-serif text-lg font-semibold bg-primary border border-line-2"
          >
            Σ
          </span>
          <span className="flex flex-col leading-tight">
            <strong className="font-sans font-bold text-base tracking-wider text-ink">
              UFMT
            </strong>
            <small className="text-[11px] text-muted-2 tracking-wide">Cálculo I &amp; VGA</small>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="relative text-sm font-medium text-ink-2 hover:text-accent transition-colors py-1.5 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform"
            >
              {label}
            </a>
          ))}
          <a
            href="/admin"
            className="ml-2 px-4 py-1.5 text-xs font-semibold text-bg rounded-full bg-ink-2 hover:bg-ink transition-colors min-h-[36px] grid place-items-center"
          >
            Admin
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Imprimir esta página"
            title="Imprimir / salvar como PDF"
            className="no-print ml-1 min-h-[36px] min-w-[36px] grid place-items-center rounded-md text-ink-2 hover:text-accent hover:bg-bg-subtle transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9V2h12v7" />
              <rect x="3" y="9" width="18" height="9" rx="1.5" />
              <path d="M6 14h12v8H6z" />
              <circle cx="18" cy="12" r="0.6" fill="currentColor" />
            </svg>
          </button>
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Imprimir"
            className="no-print min-h-[44px] min-w-[44px] grid place-items-center border border-line-2 rounded-md text-ink-2 hover:border-accent hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9V2h12v7" />
              <rect x="3" y="9" width="18" height="9" rx="1.5" />
              <path d="M6 14h12v8H6z" />
            </svg>
          </button>
          <button
            className="min-h-[44px] min-w-[44px] grid place-items-center border border-line-2 rounded-md text-ink-2 hover:border-accent hover:text-accent transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="md:hidden absolute top-full left-0 right-0 bg-bg-alt border-b border-line shadow-md flex flex-col px-6 py-3 gap-1"
          aria-label="Navegação principal"
        >
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm text-ink-2 py-3 min-h-[44px] flex items-center border-b border-line/50"
            >
              {label}
            </a>
          ))}
          <a
            href="/admin"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-accent py-3 min-h-[44px] flex items-center"
          >
            Admin →
          </a>
        </nav>
      )}
    </header>
  );
}
