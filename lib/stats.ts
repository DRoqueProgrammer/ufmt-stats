import type { StatsResult } from "./types";

/** Calcula estatísticas descritivas compatíveis com a fórmula de
 *  quartis "inclusive" (mesma definição usada no artigo original). */
export function describe(notas: number[]): StatsResult {
  if (notas.length === 0) {
    return { n: 0, min: 0, q1: 0, median: 0, q3: 0, max: 0, mean: 0, sd: 0 };
  }
  const sorted = [...notas].sort((a, b) => a - b);
  const n = sorted.length;

  const quantile = (q: number) => {
    // método "inclusive" — equivalente a numpy.percentile(..., method='linear')
    // mas ajustado para casar com statistics.quantiles(n=4, method='inclusive')
    const pos = (n - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (base + 1 < n) return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    return sorted[base];
  };

  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const variance =
    sorted.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (n - 1 || 1);

  return {
    n,
    min: sorted[0],
    q1: quantile(0.25),
    median: quantile(0.5),
    q3: quantile(0.75),
    max: sorted[n - 1],
    mean,
    sd: Math.sqrt(variance),
  };
}

export function approvalRate(notas: number[], cutoff: number) {
  if (notas.length === 0) return 0;
  return (notas.filter((n) => n >= cutoff).length / notas.length) * 100;
}

export function binNotes(notas: number[], bins = 10, max = 10) {
  const counts = new Array(bins).fill(0);
  notas.forEach((v) => {
    if (v < 0) return;
    const idx = Math.min(bins - 1, Math.floor((v / max) * bins));
    counts[idx]++;
  });
  return counts;
}
