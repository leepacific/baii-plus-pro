import { type CalcResult, ok, err } from '../../src/core/errors';
export interface RootOptions { guess?: number; min?: number; max?: number; tolerance?: number; maxIterations?: number }
export const findRoot = (f: (x: number) => number, derivative?: (x: number) => number, options: RootOptions = {}): CalcResult<number> => {
  const tolerance = options.tolerance ?? 1e-10;
  const maxIterations = options.maxIterations ?? 64;
  let x = options.guess ?? 0.1;
  for (let i = 0; i < maxIterations; i += 1) {
    const y = f(x);
    if (Math.abs(y) < tolerance) return ok(x);
    const d = derivative?.(x) ?? (f(x + 1e-6) - y) / 1e-6;
    if (!Number.isFinite(d) || Math.abs(d) < 1e-12) break;
    const next = x - y / d;
    if (!Number.isFinite(next)) break;
    x = next;
  }
  let lo = options.min ?? -0.999999;
  let hi = options.max ?? 10;
  let flo = f(lo); let fhi = f(hi);
  if (Math.sign(flo) === Math.sign(fhi)) return err(5);
  for (let i = 0; i < maxIterations; i += 1) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (Math.abs(fm) < tolerance) return ok(mid);
    if (Math.sign(flo) === Math.sign(fm)) { lo = mid; flo = fm; } else { hi = mid; fhi = fm; }
  }
  void fhi;
  return err(5);
};
