import { type BondState, accruedInterest } from './accrued-interest';
export const bondYears = (s: BondState): number => Math.max(1 / s.frequency, (s.RDT.getTime() - s.SDT.getTime()) / 31557600000);
export const bondPrice = (s: BondState, yld: number): number => {
  const periods = Math.max(1, Math.ceil(bondYears(s) * s.frequency)); const c = s.RV * s.CPN / 100 / s.frequency; const r = yld / 100 / s.frequency;
  let pv = 0; for (let t = 1; t <= periods; t += 1) pv += c / (1 + r) ** t;
  return pv + s.RV / (1 + r) ** periods - accruedInterest(s);
};
