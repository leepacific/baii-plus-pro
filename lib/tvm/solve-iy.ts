import { findRoot } from './root-finder';
import { tvmResidualWithRate } from './formula';
import { type TvmInput } from './types';
export const solveIY = (s: Omit<TvmInput, 'IY'>): number => {
  const result = findRoot((i) => tvmResidualWithRate(s, i), undefined, { guess: 0.01, min: -0.999, max: 10 });
  return result.ok ? (s.CY * ((1 + result.value) ** (s.PY / s.CY) - 1) * 100) : Number.NaN;
};
