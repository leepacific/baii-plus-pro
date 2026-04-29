export interface DepResult { DEP: number; RBV: number; RDV: number }
export const sl = (cost: number, salvage: number, life: number, year: number): DepResult => {
  const dep = (cost - salvage) / life;
  const total = Math.min(year, life) * dep;
  return { DEP: year <= life ? dep : 0, RBV: cost - total, RDV: Math.max(0, cost - salvage - total) };
};
