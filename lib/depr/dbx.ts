import { type DepResult } from './sl';
export const dbx = (cost: number, salvage: number, life: number, dbPercent: number, year: number): DepResult => {
  let rbv = cost, dep = 0; const rate = dbPercent / 100 / life;
  for (let y = 1; y <= year; y += 1) { const dbDep = rbv * rate; const slDep = (rbv - salvage) / (life - y + 1); dep = Math.min(Math.max(dbDep, slDep), rbv - salvage); rbv -= dep; }
  return { DEP: dep, RBV: rbv, RDV: Math.max(0, rbv - salvage) };
};
