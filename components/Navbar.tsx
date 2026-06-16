"use client";
import { useEffect, useState } from "react";

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
    ["#conclusao", "Conclusão"],
    ["#autores", "Autores"],
  ];

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur transition-colors ${
        scrolled ? "bg-white/85 border-b border-line" : "bg-transparent"
      }`}
      style={{ top: scrolled ? 0 : 24 }}
    >
      <div className="container mx-auto px-6 max-w-[1200px] flex items-center justify-between py-3.5">
        <a href="#hero" className="flex items-center gap-3 no-underline">
          <span
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
            className="ml-2 px-4 py-1.5 text-xs font-semibold text-white rounded-full bg-ink-2 hover:bg-ink transition-colors"
          >
            Admin
          </a>
        </nav>

        <button
          className="md:hidden border border-line-2 rounded-md px-2 py-1 text-lg"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-line shadow-md flex flex-col px-6 py-3 gap-1">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm text-ink-2 py-2 border-b border-line/50"
            >
              {label}
            </a>
          ))}
          <a
            href="/admin"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-accent py-2"
          >
            Admin →
          </a>
        </nav>
      )}
    </header>
  );
}
