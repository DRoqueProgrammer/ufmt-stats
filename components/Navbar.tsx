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
            className="w-10 h-10 rounded-[10px] grid place-items-center text-white font-serif text-lg font-semibold shadow-sm"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-2))" }}
          >
            Σ
          </span>
          <span className="flex flex-col leading-tight">
            <strong className="font-sans font-bold text-base tracking-wider text-ink">
              UFMT
            </strong>
            <small className="text-[11px] text-muted tracking-wide">Cálculo I &amp; VGA</small>
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
            className="ml-2 px-4 py-1.5 text-xs font-semibold text-white rounded-full bg-ink-2 hover:bg-ink transition-colors min-h-[36px] grid place-items-center"
          >
            Admin
          </a>
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="min-h-[44px] min-w-[44px] grid place-items-center border border-line-2 rounded-md text-ink-2 hover:border-accent hover:text-accent transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            <span aria-hidden="true" className="text-lg leading-none">{open ? "✕" : "☰"}</span>
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
