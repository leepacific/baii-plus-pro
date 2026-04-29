import { periodicRate } from './py-field';
import { paymentShiftFactor } from './timing-mode';
import { type TvmInput } from './types';
export const rate = (s: Pick<TvmInput, 'IY'|'PY'|'CY'>): number => periodicRate(s.IY, s.PY, s.CY);
export const tvmResidualWithRate = (s: Omit<TvmInput, 'IY'>, i: number): number => {
  const shift = paymentShiftFactor(i, s.timing);
  if (Math.abs(i) < 1e-12) return s.PV + s.PMT * s.N + s.FV;
  return s.PV * (1 + i) ** s.N + s.PMT * shift * (((1 + i) ** s.N - 1) / i) + s.FV;
};
export const tvmResidual = (s: TvmInput): number => tvmResidualWithRate(s, rate(s));
