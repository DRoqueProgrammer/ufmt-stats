"use client";
import { useEffect, useRef, useState } from "react";

/** Returns a counter that increments every time the `<html>` element's
 *  `class` attribute changes. Used as a dependency in chart effects so
 *  the chart is rebuilt with fresh theme colors when the user toggles
 *  light/dark. */
function useThemeTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const obs = new MutationObserver(() => setTick((t) => t + 1));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return tick;
}
import type { Grupo } from "@/lib/types";
import { binNotes } from "@/lib/stats";

/* Chart.js is loaded via dynamic import (bundled, not CDN).
 *  One-time module-level promise so 3 charts share the same instance. */
let _chartJsPromise: Promise<typeof import("chart.js/auto").default> | null = null;
function loadChartJs() {
  if (typeof window === "undefined") return null;
  if (!_chartJsPromise) {
    _chartJsPromise = import("chart.js/auto").then((m) => m.default);
  }
  return _chartJsPromise;
}

/** Reads the OKLCH tokens from :root at chart init time. Charts now
 *  follow the design system automatically — change tokens in globals.css
 *  or tailwind.config.ts and the colors update here too. */
function readTheme() {
  if (typeof window === "undefined") {
    // SSR fallback — matches the OKLCH tokens; never used because all
    // chart components are client-only and bail out before this path.
    return {
      ink: "#1d2538", ink2: "#2a3450",
      muted: "#5a6478", line: "#d9dde3",
      primary: "#384b7a", accent: "#e87a35",
      accent2: "#f0a878", onDark: "#d3d8e0",
      bg: "#f6f7f8", white: "#ffffff",
    };
  }
  // PRINT: return hard-coded dark hex that always renders correctly on
  // white paper. The CSS @media print rule also sets these but the
  // canvas reads values via getComputedStyle which can return `lab()`
  // instead of hex in some browsers.
  if (typeof window.matchMedia === "function" && window.matchMedia("print").matches) {
    return {
      ink: "rgb(0,0,0)", ink2: "rgb(26,26,26)",
      muted: "rgb(68,68,68)", line: "rgb(153,153,153)",
      primary: "rgb(26,37,64)", accent: "rgb(194,90,31)",
      accent2: "rgb(217,122,71)", onDark: "rgb(26,26,26)",
      bg: "rgb(255,255,255)", white: "rgb(255,255,255)",
    };
  }
  // Read CSS variable and normalize to rgb(). Browsers return computed
  // values in `oklch()` / `lab()` which Chart.js's color parser doesn't
  // understand (it falls back to a light gray). Trick: set color on a
  // detached element and read getComputedStyle().color — this is always
  // an `rgb(...)` string the browser has already resolved.
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  const css = (n: string) => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    if (!raw) return "rgb(0,0,0)";
    probe.style.color = "";
    probe.style.color = raw;
    return getComputedStyle(probe).color || raw;
  };
  const out = {
    ink: css("--ink"),
    ink2: css("--ink-2"),
    muted: css("--muted"),
    line: css("--line"),
    primary: css("--primary"),
    accent: css("--accent"),
    accent2: css("--accent-2"),
    onDark: css("--on-dark"),
    bg: css("--bg"),
    white: css("--bg"),
  };
  probe.remove();
  return out;
}

/** Fallback UI when Chart.js fails to load (offline, blocked CDN, etc). */
function ChartError({ message }: { message: string }) {
  return (
    <div
      role="img"
      aria-label="Gráfico indisponível"
      className="h-[360px] grid place-items-center bg-bg-subtle rounded-[14px] border border-dashed border-line-2"
    >
      <div className="text-center max-w-xs">
        <div aria-hidden="true" className="w-10 h-10 mx-auto mb-3 rounded-full bg-warn-soft text-warn grid place-items-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p className="text-sm text-ink-2 font-semibold m-0">Gráfico indisponível</p>
        <p className="text-xs text-muted-2 m-0 mt-1">{message}</p>
      </div>
    </div>
  );
}

/* ---------------- BOXPLOT ---------------- */
export function Boxplot({ grupos, cutoff = 5 }: { grupos: Grupo[]; cutoff?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const themeTick = useThemeTick();

  useEffect(() => {
    let chart: any = null;
    let disposed = false;
    (async () => {
      let Chart: any;
      try {
        Chart = await loadChartJs();
        if (!Chart || !canvasRef.current || disposed) return;
      } catch (e) {
        setError("Não foi possível carregar o módulo de gráficos.");
        return;
      }
      const theme = readTheme();

      const boxplotPlugin = {
        id: "customBoxplot",
        afterDatasetsDraw(chart: any) {
          const { ctx, scales, chartArea } = chart;
          const data = chart.config.options.plugins.customBoxplot.data;
          const boxW = Math.min(50, (chartArea.right - chartArea.left) / data.length * 0.55);
          data.forEach((d: any, i: number) => {
            const x = scales.x.getPixelForValue(i);
            const yMin = scales.y.getPixelForValue(d.min);
            const yQ1  = scales.y.getPixelForValue(d.q1);
            const yMed = scales.y.getPixelForValue(d.median);
            const yQ3  = scales.y.getPixelForValue(d.q3);
            const yMax = scales.y.getPixelForValue(d.max);
            ctx.strokeStyle = d.color; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(x, yMin); ctx.lineTo(x, yMax); ctx.stroke();
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(x - boxW/2, yMin); ctx.lineTo(x + boxW/2, yMin);
            ctx.moveTo(x - boxW/2, yMax); ctx.lineTo(x + boxW/2, yMax);
            ctx.stroke();
            // color-mix adds alpha in any color space (oklch/lab/hex); the
            // old `+ "24"` hex-alpha hack broke when we moved to OKLCH tokens.
            ctx.fillStyle = `color-mix(in oklch, ${d.color} 15%, transparent)`;
            ctx.fillRect(x - boxW/2, yQ3, boxW, yQ1 - yQ3);
            ctx.lineWidth = 2; ctx.strokeStyle = d.color;
            ctx.strokeRect(x - boxW/2, yQ3, boxW, yQ1 - yQ3);
            // Median (dark line)
            ctx.lineWidth = 4; ctx.strokeStyle = theme.ink;
            ctx.beginPath(); ctx.moveTo(x - boxW/2 + 2, yMed); ctx.lineTo(x + boxW/2 - 2, yMed); ctx.stroke();
            ctx.lineWidth = 1.5; ctx.strokeStyle = theme.bg;
            ctx.beginPath(); ctx.moveTo(x - boxW/2 + 2, yMed); ctx.lineTo(x + boxW/2 - 2, yMed); ctx.stroke();
            // Mean diamond
            const yMean = scales.y.getPixelForValue(d.mean);
            ctx.fillStyle = d.accent;
            ctx.beginPath();
            ctx.moveTo(x, yMean - 6); ctx.lineTo(x + 6, yMean); ctx.lineTo(x, yMean + 6); ctx.lineTo(x - 6, yMean);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.4; ctx.stroke();
          });
        }
      };
      const referencePlugin = {
        id: "referenceLine",
        afterDraw(chart: any) {
          const v = chart.config.options.plugins.referenceLine.value;
          if (v == null) return;
          const { ctx, scales, chartArea } = chart;
          const y = scales.y.getPixelForValue(v);
          if (y < chartArea.top || y > chartArea.bottom) return;
          ctx.save();
          ctx.strokeStyle = theme.accent; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(chartArea.left, y); ctx.lineTo(chartArea.right, y); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = theme.accent;
          ctx.font = "600 11px 'IBM Plex Sans', system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
          ctx.fillText(`Aprovação ≥ ${cutoff.toFixed(1)}`, chartArea.right - 6, y - 4);
          ctx.restore();
        }
      };

      chart = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: grupos.map((g) => g.short),
          datasets: [{ data: grupos.map(() => 0), backgroundColor: "transparent" }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 18 } },
          scales: {
            x: { ticks: { color: theme.ink2, font: { size: 12, weight: 500 } }, grid: { display: false } },
            y: { min: 0, max: 10, title: { display: true, text: "Nota final (0 a 10)", color: theme.ink2, font: { size: 12, weight: 500 } }, ticks: { color: theme.ink2, font: { size: 11 } }, grid: { color: theme.line } },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: theme.ink, titleColor: theme.bg, bodyColor: theme.bg, padding: 10,
              external: (ctx: any) => {
                const tooltip = ctx.tooltip;
                const chart = ctx.chart;
                let el = tooltipRef.current;
                if (!el) {
                  el = document.createElement("div");
                  Object.assign(el.style, {
                    position: "absolute", pointerEvents: "none", background: theme.ink,
                    color: theme.bg, borderRadius: "6px", padding: "10px 12px",
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    transform: "translate(-50%, -100%)", transition: "opacity .15s",
                    opacity: 0, zIndex: "5", whiteSpace: "nowrap",
                  });
                  chart.canvas.parentNode.appendChild(el);
                  tooltipRef.current = el;
                }
                if (tooltip.opacity === 0) { el.style.opacity = "0"; return; }
                const idx = tooltip.dataPoints?.[0]?.dataIndex ?? 0;
                const g = grupos[idx];
                el.innerHTML = `
                  <div style="font-weight:600;margin-bottom:4px">${g.label}</div>
                  <div>Máx: <strong>${g.stats.max.toFixed(2)}</strong></div>
                  <div>Q3: <strong>${g.stats.q3.toFixed(2)}</strong></div>
                  <div style="color:${theme.accent2}">Med: <strong>${g.stats.median.toFixed(2)}</strong></div>
                  <div>Q1: <strong>${g.stats.q1.toFixed(2)}</strong></div>
                  <div>Mín: <strong>${g.stats.min.toFixed(2)}</strong></div>
                  <div style="margin-top:4px;border-top:1px solid ${theme.line};padding-top:4px">
                    Média (◇): <strong style="color:${g.disciplinaColor}">${g.stats.mean.toFixed(2)}</strong> · DP: ${g.stats.sd.toFixed(2)}
                  </div>`;
                el.style.opacity = "1";
                el.style.left = tooltip.caretX + "px";
                el.style.top  = (tooltip.caretY - 14) + "px";
              }
            },
            referenceLine: { value: cutoff },
            customBoxplot: { data: grupos.map((g) => ({
              min: g.stats.min, q1: g.stats.q1, median: g.stats.median,
              q3: g.stats.q3, max: g.stats.max, mean: g.stats.mean,
              color: g.turmaColor, accent: g.disciplinaColor,
            }))},
          },
        },
        plugins: [boxplotPlugin, referencePlugin],
      });
    })();
    return () => { disposed = true; chart?.destroy?.(); tooltipRef.current?.remove(); tooltipRef.current = null; };
  }, [grupos, cutoff, themeTick]);

  return error ? <ChartError message={error} /> : <div className="relative h-[360px]"><canvas ref={canvasRef} /></div>;
}

/* ---------------- HISTOGRAM ---------------- */
export function Histogram({ grupos, cutoff = 5, bins = 10 }: { grupos: Grupo[]; cutoff?: number; bins?: number }) {
  const themeTick = useThemeTick();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let chart: any = null;
    let disposed = false;
    (async () => {
      let Chart: any;
      try {
        Chart = await loadChartJs();
        if (!Chart || !canvasRef.current || disposed) return;
      } catch (e) {
        setError("Não foi possível carregar o módulo de gráficos.");
        return;
      }
      const theme = readTheme();
      const referencePlugin = {
        id: "referenceLine",
        afterDraw(chart: any) {
          const v = chart.config.options.plugins.referenceLine.value;
          if (v == null) return;
          const { ctx, scales, chartArea } = chart;
          const y = scales.y.getPixelForValue(v);
          if (y < chartArea.top || y > chartArea.bottom) return;
          ctx.save();
          ctx.strokeStyle = theme.accent; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(chartArea.left, y); ctx.lineTo(chartArea.right, y); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = theme.accent;
          ctx.font = "600 11px 'IBM Plex Sans', system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
          ctx.fillText(`Aprovação ≥ ${cutoff.toFixed(1)}`, chartArea.right - 6, y - 4);
          ctx.restore();
        }
      };
      const labels = Array.from({ length: bins }, (_, i) => {
        const lo = (i * 10) / bins; const hi = ((i + 1) * 10) / bins;
        return `${lo.toFixed(1)}–${hi.toFixed(1)}`;
      });
      const datasets = grupos.map((g) => {
        const counts = binNotes(g.notas, bins, 10);
        const total = counts.reduce((a, b) => a + b, 0) || 1;
        return {
          label: g.short,
          data: counts.map((c) => (c / total) * 100),
          backgroundColor: `color-mix(in oklch, ${g.turmaColor} 73%, transparent)`,
          borderColor: g.turmaColor,
          borderWidth: 1.5,
          borderRadius: 3,
          categoryPercentage: 0.92,
          barPercentage: 0.95,
        };
      });
      chart = new Chart(canvasRef.current, {
        type: "bar",
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          scales: {
            x: { title: { display: true, text: "Faixa de nota final (0 a 10)", color: theme.ink2, font: { size: 12, weight: 500 } }, ticks: { color: theme.ink2, font: { size: 11 } }, grid: { display: false } },
            y: { title: { display: true, text: "Frequência relativa (%)", color: theme.ink2, font: { size: 12, weight: 500 } }, beginAtZero: true, ticks: { color: theme.ink2, font: { size: 11 }, callback: (v: any) => v + "%" }, grid: { color: theme.line } },
          },
          plugins: {
            legend: { position: "top", align: "end", labels: { boxWidth: 12, boxHeight: 12, color: theme.ink2, font: { size: 11 } } },
            tooltip: { backgroundColor: theme.ink, titleColor: theme.bg, bodyColor: theme.bg, padding: 10,
              callbacks: { title: (items: any) => `Faixa ${items[0].label}`, label: (c: any) => ` ${c.dataset.label}: ${c.parsed.y.toFixed(1)}%` }
            },
            referenceLine: { value: cutoff },
          },
        },
        plugins: [referencePlugin],
      });
    })();
    return () => { disposed = true; chart?.destroy?.(); };
  }, [grupos, cutoff, bins, themeTick]);

  return error ? <ChartError message={error} /> : <div className="relative h-[360px]"><canvas ref={canvasRef} /></div>;
}

/* ---------------- APPROVAL BARS ---------------- */
export function ApprovalBars({ grupos, cutoff = 5 }: { grupos: Grupo[]; cutoff?: number }) {
  const themeTick = useThemeTick();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let chart: any = null;
    let disposed = false;
    (async () => {
      let Chart: any;
      try {
        Chart = await loadChartJs();
        if (!Chart || !canvasRef.current || disposed) return;
      } catch (e) {
        setError("Não foi possível carregar o módulo de gráficos.");
        return;
      }
      const theme = readTheme();
      const referencePlugin = {
        id: "referenceLine",
        afterDraw(chart: any) {
          const v = chart.config.options.plugins.referenceLine.value;
          if (v == null) return;
          const { ctx, scales, chartArea } = chart;
          const y = scales.y.getPixelForValue(v);
          if (y < chartArea.top || y > chartArea.bottom) return;
          ctx.save();
          ctx.strokeStyle = theme.accent; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(chartArea.left, y); ctx.lineTo(chartArea.right, y); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = theme.accent;
          ctx.font = "600 11px 'IBM Plex Sans', system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
          ctx.fillText("Linha de 50%", chartArea.right - 6, y - 4);
          ctx.restore();
        }
      };
      const valueLabelPlugin = {
        id: "valueLabel",
        afterDatasetsDraw(chart: any) {
          const { ctx } = chart;
          const meta = chart.getDatasetMeta(0);
          const data = chart.data.datasets[0].data;
          ctx.save();
          ctx.fillStyle = theme.ink;
          ctx.font = "700 15px Lora, serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          meta.data.forEach((bar: any, i: number) => {
            ctx.fillText(data[i].toFixed(2).replace(".", ",") + "%", bar.x, bar.y - 6);
          });
          ctx.restore();
        }
      };
      chart = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: grupos.map((g) => g.short),
          datasets: [{
            label: "Aprovação (%)",
            data: grupos.map((g) => g.approval),
            backgroundColor: grupos.map((g) => `color-mix(in oklch, ${g.disciplinaColor} 80%, transparent)`),
            borderColor: grupos.map((g) => g.disciplinaColor),
            borderWidth: 2,
            borderRadius: 8,
            maxBarThickness: 64,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 30 } },
          scales: {
            x: { ticks: { color: theme.ink2, font: { size: 12, weight: 500 } }, grid: { display: false } },
            y: { min: 0, max: 50, title: { display: true, text: "Aprovação (%)", color: theme.ink2, font: { size: 12, weight: 500 } }, ticks: { color: theme.ink2, font: { size: 11 }, callback: (v: any) => v + "%" }, grid: { color: theme.line } },
          },
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: theme.ink, titleColor: theme.bg, bodyColor: theme.bg, padding: 10,
              callbacks: { title: (items: any) => items[0].label, label: (c: any) => {
                const g = grupos[c.dataIndex];
                return ` ${g.approval.toFixed(2)}% de aprovação`;
              }, afterLabel: (c: any) => {
                const g = grupos[c.dataIndex];
                return `Média: ${g.stats.mean.toFixed(2)} · Mediana: ${g.stats.median.toFixed(2)}`;
              } }
            },
            referenceLine: { value: 50 },
          },
        },
        plugins: [referencePlugin, valueLabelPlugin],
      });
    })();
    return () => { disposed = true; chart?.destroy?.(); };
  }, [grupos, cutoff, themeTick]);

  return error ? <ChartError message={error} /> : <div className="relative h-[360px]"><canvas ref={canvasRef} /></div>;
}
