import { periodicRate } from '../tvm/py-field';
export interface AmortTvmState { N: number; IY: number; PV: number; PMT: number; FV: number; PY: number; CY: number; timing: 'END'|'BGN' }
export const balanceAt = (s: AmortTvmState, n: number): number => {
  const i = periodicRate(s.IY, s.PY, s.CY);
  if (n === 0) return s.PV;
  if (Math.abs(i) < 1e-12) return s.PV + s.PMT * n;
  const shift = s.timing === 'BGN' ? 1 + i : 1;
  return s.PV * (1 + i) ** n + s.PMT * shift * (((1 + i) ** n - 1) / i);
};
