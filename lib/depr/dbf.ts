import { db } from './db';
import { fiscalFraction } from './proration';
export const dbf = (cost: number, salvage: number, life: number, dbPercent: number, m01: number, year: number) => {
  const base = db(cost, salvage, life, dbPercent, Math.min(year, life));
  return year === 1 ? { ...base, DEP: base.DEP * fiscalFraction(m01) } : base;
};
