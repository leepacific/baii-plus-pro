import { type DepResult } from './sl';
export const syd = (cost: number, salvage: number, life: number, year: number): DepResult => {
  const base = cost - salvage; const denom = life * (life + 1) / 2;
  const dep = year <= life ? (life - year + 1) / denom * base : 0;
  let total = 0; for (let y = 1; y <= Math.min(year, life); y += 1) total += (life - y + 1) / denom * base;
  return { DEP: dep, RBV: cost - total, RDV: Math.max(0, base - total) };
};
