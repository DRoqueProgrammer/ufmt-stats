#!/usr/bin/env python3
"""
Idempotent 5-page print fix.
Replaces specific patterns in globals.css, page.tsx, StatusBreakdown.tsx.
Safe to run multiple times.
"""
import re, sys, pathlib

ROOT = pathlib.Path(".")

def patch(path, replacements, *, expect_present=True):
    p = ROOT / path
    src = p.read_text(encoding="utf-8")
    out = src
    for old, new in replacements:
        if old not in out:
            if expect_present:
                print(f"  WARN: pattern not found in {path}:")
                print(f"        {old[:80]!r}")
            continue
        out = out.replace(old, new, 1)
        print(f"  OK: replaced in {path}: {old[:60]!r}")
    if out != src:
        p.write_text(out, encoding="utf-8")
        print(f"  → wrote {path}")
    else:
        print(f"  → no change to {path}")

# ---- app/globals.css ----
print("\n[1/3] app/globals.css")
patch("app/globals.css", [
    # Fix: only hide TOP-level nav/header, not headers inside Conclusão cards
    (
        "  /* Hide UI chrome */\n"
        "  nav, header, .no-print, [data-no-print],\n"
        "  .demo-banner, .skip-to-content, footer, .no-print-footer {\n"
        "    display: none !important;\n"
        "  }",
        "  /* Hide UI chrome — only the top-level nav/header, not headers\n"
        "     inside sections (which are semantic for cards/groups). */\n"
        "  body > nav, body > header, header[role=\"banner\"],\n"
        "  .no-print, [data-no-print],\n"
        "  .demo-banner, .skip-to-content, footer, .no-print-footer {\n"
        "    display: none !important;\n"
        "  }",
    ),
    # Hide Metodologia section in print
    (
        "  /* Section spacing: tight, never break across pages unless forced */\n"
        "  section { margin-bottom: 3mm; break-inside: avoid; }",
        "  /* Section spacing: tight, never break across pages unless forced */\n"
        "  section { margin-bottom: 3mm; break-inside: avoid; }\n"
        "  /* Hide Metodologia in print: it duplicates page intro */\n"
        "  #metodologia { display: none; }\n"
        "  /* Force page breaks to land on 5 A4 pages */\n"
        "  #distribuicao { break-before: page; }\n"
        "  #aprovacao { break-after: avoid; }\n"
        "  #conclusao { break-before: avoid; page-break-before: avoid; }\n"
        "  #autores { display: none !important; } /* names already in printHeader */",
    ),
    # Hide the 3 finding cards in print
    (
        "  #status .mt-8.grid { display: none; }",
        "  /* Hide the 3 finding cards in print - they duplicate insights */\n"
        "  #status .mt-8.grid { display: none; }",
    ),
    # Conclusão padding (extra top for headers)
    (
        "  #conclusao [class*=\"p-\"] { padding: 2mm !important; }",
        "  #conclusao [class*=\"p-\"] { padding: 4mm 3mm 3mm 5mm !important; }\n"
        "  #conclusao header { margin-bottom: 2mm !important; }",
    ),
])

# ---- components/charts/StatusBreakdown.tsx ----
print("\n[2/3] components/charts/StatusBreakdown.tsx")
patch("components/charts/StatusBreakdown.tsx", [
    # Replace absolute top accent line (clipped on page breaks) with left border
    (
        '          <article\n'
        '            key={g.id}\n'
        '            className="relative bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm"\n'
        '          >\n'
        '            {/* Top accent rule — full hairline, not a side-stripe.\n'
        '                Color encodes the subject discipline (Cálculo I vs VGA). */}\n'
        '            <span\n'
        '              aria-hidden="true"\n'
        '              className="absolute inset-x-0 top-0 h-[3px] rounded-t-[14px]"\n'
        '              style={{ background: g.disciplinaColor }}\n'
        '            />\n',
        '          <article\n'
        '            key={g.id}\n'
        '            className="relative bg-bg-alt border border-line rounded-[14px] p-4 pl-5 shadow-sm border-l-4"\n'
        '            style={{ borderLeftColor: g.disciplinaColor }}\n'
        '          >\n',
    ),
])

# ---- app/page.tsx ----
print("\n[3/3] app/page.tsx")
patch("app/page.tsx", [
    # Replace top border (clipped) with left border on Conclusão cards
    (
        '            <article className="bg-bg-alt border border-line rounded-[14px] p-6 shadow-sm border-t-4 border-primary">',
        '            <article className="bg-bg-alt border border-line rounded-[14px] p-6 pl-5 shadow-sm border-l-4 border-primary">',
    ),
    (
        '            <article className="bg-bg-alt border border-line rounded-[14px] p-6 shadow-sm border-t-4 border-accent">',
        '            <article className="bg-bg-alt border border-line rounded-[14px] p-6 pl-5 shadow-sm border-l-4 border-accent">',
    ),
])

print("\n✓ Done. Run 'npm run build' then Ctrl+P to test.")
