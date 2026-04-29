import { rate } from './formula';
import { paymentShiftFactor } from './timing-mode';
import { type TvmInput } from './types';
export const solveFV = (s: Omit<TvmInput, 'FV'>): number => {
  const i = rate(s); const shift = paymentShiftFactor(i, s.timing);
  if (Math.abs(i) < 1e-12) return -(s.PV + s.PMT * s.N);
  return -(s.PV * (1 + i) ** s.N + s.PMT * shift * (((1 + i) ** s.N - 1) / i));
};
