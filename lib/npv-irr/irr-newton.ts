import { expandCashflows, type CashflowTerm } from './npv';
export type IrrNewtonResult = { type: 'converged'; rate: number; iterations: number } | { type: 'diverged'; iterations: number };
export const irrNewton = (cashflows: CashflowTerm[], guessPercent = 10, maxIterations = 64): IrrNewtonResult => {
  const expanded = expandCashflows(cashflows);
  let r = guessPercent / 100;
  for (let i = 0; i < maxIterations; i += 1) {
    const f = expanded.reduce((sum, cf, t) => sum + cf / (1 + r) ** t, 0);
    if (Math.abs(f) < 1e-10) return { type: 'converged', rate: r * 100, iterations: i + 1 };
    const d = expanded.reduce((sum, cf, t) => t === 0 ? sum : sum - t * cf / (1 + r) ** (t + 1), 0);
    if (!Number.isFinite(d) || Math.abs(d) < 1e-12) return { type: 'diverged', iterations: i + 1 };
    const next = r - f / d;
    if (!Number.isFinite(next) || next <= -0.999999) return { type: 'diverged', iterations: i + 1 };
    r = next;
  }
  return { type: 'diverged', iterations: maxIterations };
};
