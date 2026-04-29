import { fiscalFraction } from './proration';
import { type DepResult } from './sl';
export const slf = (cost: number, salvage: number, life: number, m01: number, year: number): DepResult => {
  const full = (cost - salvage) / life; const frac = fiscalFraction(m01);
  const dep = year === 1 ? full * frac : year === life + 1 ? full * (1 - frac) : year <= life ? full : 0;
  let total = 0; for (let y = 1; y <= year; y += 1) total += y === 1 ? full * frac : y === life + 1 ? full * (1 - frac) : y <= life ? full : 0;
  return { DEP: dep, RBV: cost - total, RDV: Math.max(0, cost - salvage - total) };
};
