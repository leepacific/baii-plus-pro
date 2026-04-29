import { checkSignConvention } from './sign-convention';
import { rate } from './formula';
import { paymentShiftFactor } from './timing-mode';
import { type TvmInput } from './types';
export const solvePV = (s: Omit<TvmInput, 'PV'>): number => {
  const i = rate(s); const shift = paymentShiftFactor(i, s.timing);
  if (Math.abs(i) < 1e-12) return -(s.PMT * s.N + s.FV);
  return -(s.PMT * shift * (((1 + i) ** s.N - 1) / i) + s.FV) / (1 + i) ** s.N;
};
export const solvePVOrError = (s: Omit<TvmInput, 'PV'>) => checkSignConvention(s.PMT, s.FV).ok ? ({ ok: true as const, value: solvePV(s) }) : ({ ok: false as const, error: 5 as const });
