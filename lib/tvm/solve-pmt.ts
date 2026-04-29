import { rate } from './formula';
import { paymentShiftFactor } from './timing-mode';
import { type TvmInput } from './types';
export const solvePMT = (s: Omit<TvmInput, 'PMT'>): number => {
  const i = rate(s); const shift = paymentShiftFactor(i, s.timing);
  if (Math.abs(i) < 1e-12) return -(s.PV + s.FV) / s.N;
  return -(s.PV * (1 + i) ** s.N + s.FV) / (shift * (((1 + i) ** s.N - 1) / i));
};
