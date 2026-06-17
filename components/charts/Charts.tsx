"use client";
import { useEffect, useRef } from "react";
import type { Grupo } from "@/lib/types";
import { binNotes } from "@/lib/stats";

/* Chart.js carregado uma vez no client */
declare global {
  interface Window {
    Chart?: any;
  }
}

/** Reads the OKLCH tokens from :root at chart init time. Charts now
 *  follow the design system automatically — change tokens in globals.css
 *  or tailwind.config.ts and the colors update here too. */
function readTheme() {
  if (typeof window === "undefined") {
    // SSR fallback — matches the OKLCH tokens; never used because all
    // chart components are client-only and bail out before this path.
    return {
      ink: "oklch(20% 0.04 250)", ink2: "oklch(26% 0.05 250)",
      muted: "oklch(48% 0.022 250)", line: "oklch(91% 0.012 250)",
      primary: "oklch(35% 0.08 250)", accent: "oklch(70% 0.18 35)",
      onDark: "oklch(82% 0.02 250)", white: "oklch(100% 0 0)",
    };
  }
  const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  return {
    ink: css("--ink"),
    ink2: css("--ink-2"),
    muted: css("--muted"),
    line: css("--line"),
    primary: css("--primary"),
    accent: css("--accent"),
    onDark: css("--on-dark"),
    white: "oklch(100% 0 0)",
  };
}

let _chartJsPromise: Promise<any> | null = null;
async function loadChartJs() {
  if (typeof window === "undefined") return null;
  if (window.Chart) return window.Chart;
  if (_chartJsPromise) return _chartJsPromise;
  _chartJsPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
    s.onload = () => resolve(window.Chart);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _chartJsPromise;
}

/* ---------------- BOXPLOT ---------------- */
export function Boxplot({ grupos, cutoff = 5 }: { grupos: Grupo[]; cutoff?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let chart: any = null;
    let disposed = false;
    (async () => {
      const Chart = await loadChartJs();
      if (!Chart || !canvasRef.current || disposed) return;
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
            ctx.lineWidth = 1.5; ctx.strokeStyle = theme.white;
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
          ctx.font = "600 11px Inter, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
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
            y: { min: 0, max: 10, title: { display: true, text: "Nota final (0 a 10)", color: theme.muted, font: { size: 12, weight: 500 } }, ticks: { color: theme.muted, font: { size: 11 } }, grid: { color: theme.line } },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: theme.ink, titleColor: theme.white, bodyColor: theme.onDark, padding: 10,
              external: (ctx: any) => {
                const tooltip = ctx.tooltip;
                const chart = ctx.chart;
                let el = tooltipRef.current;
                if (!el) {
                  el = document.createElement("div");
                  Object.assign(el.style, {
                    position: "absolute", pointerEvents: "none", background: theme.ink,
                    color: theme.white, borderRadius: "8px", padding: "10px 12px",
                    fontFamily: "Inter, sans-serif", fontSize: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
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
                  <div style="color:#ff8c66">Med: <strong>${g.stats.median.toFixed(2)}</strong></div>
                  <div>Q1: <strong>${g.stats.q1.toFixed(2)}</strong></div>
                  <div>Mín: <strong>${g.stats.min.toFixed(2)}</strong></div>
                  <div style="margin-top:4px;border-top:1px solid #1a3a5c;padding-top:4px">
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
  }, [grupos, cutoff]);

  return <div className="relative h-[360px]"><canvas ref={canvasRef} /></div>;
}

/* ---------------- HISTOGRAM ---------------- */
export function Histogram({ grupos, cutoff = 5, bins = 10 }: { grupos: Grupo[]; cutoff?: number; bins?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart: any = null;
    let disposed = false;
    (async () => {
      const Chart = await loadChartJs();
      if (!Chart || !canvasRef.current || disposed) return;
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
          ctx.font = "600 11px Inter, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
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
            x: { title: { display: true, text: "Faixa de nota final (0 a 10)", color: theme.muted, font: { size: 12, weight: 500 } }, ticks: { color: theme.muted, font: { size: 11 } }, grid: { display: false } },
            y: { title: { display: true, text: "Frequência relativa (%)", color: theme.muted, font: { size: 12, weight: 500 } }, beginAtZero: true, ticks: { color: theme.muted, font: { size: 11 }, callback: (v: any) => v + "%" }, grid: { color: theme.line } },
          },
          plugins: {
            legend: { position: "top", align: "end", labels: { boxWidth: 12, boxHeight: 12, color: theme.ink2, font: { size: 11 } } },
            tooltip: { backgroundColor: theme.ink, titleColor: theme.white, bodyColor: theme.onDark, padding: 10,
              callbacks: { title: (items: any) => `Faixa ${items[0].label}`, label: (c: any) => ` ${c.dataset.label}: ${c.parsed.y.toFixed(1)}%` }
            },
            referenceLine: { value: cutoff },
          },
        },
        plugins: [referencePlugin],
      });
    })();
    return () => { disposed = true; chart?.destroy?.(); };
  }, [grupos, cutoff, bins]);

  return <div className="relative h-[360px]"><canvas ref={canvasRef} /></div>;
}

/* ---------------- APPROVAL BARS ---------------- */
export function ApprovalBars({ grupos, cutoff = 5 }: { grupos: Grupo[]; cutoff?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart: any = null;
    let disposed = false;
    (async () => {
      const Chart = await loadChartJs();
      if (!Chart || !canvasRef.current || disposed) return;
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
          ctx.font = "600 11px Inter, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
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
            y: { min: 0, max: 50, title: { display: true, text: "Aprovação (%)", color: theme.muted, font: { size: 12, weight: 500 } }, ticks: { color: theme.muted, font: { size: 11 }, callback: (v: any) => v + "%" }, grid: { color: theme.line } },
          },
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: theme.ink, titleColor: theme.white, bodyColor: theme.onDark, padding: 10,
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
  }, [grupos, cutoff]);

  return <div className="relative h-[360px]"><canvas ref={canvasRef} /></div>;
}
