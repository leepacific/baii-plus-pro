import { rate } from './formula';
import { findRoot } from './root-finder';
import { type TvmInput } from './types';
export const solveN = (s: Omit<TvmInput, 'N'>): number => {
  const i = rate(s);
  if (Math.abs(i) < 1e-12) return -(s.PV + s.FV) / s.PMT;
  const result = findRoot((n) => s.PV * (1 + i) ** n + s.PMT * (s.timing === 'BGN' ? 1 + i : 1) * (((1 + i) ** n - 1) / i) + s.FV, undefined, { guess: 12, min: 0, max: 10000 });
  return result.ok ? result.value : Number.NaN;
};
