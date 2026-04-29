import { type CalcDate } from './parse';
export const thirty360DayCount = (a: CalcDate, b: CalcDate): number => {
  const d1 = Math.min(a.day, 30);
  const d2 = a.day >= 30 ? Math.min(b.day, 30) : b.day;
  return (b.year - a.year) * 360 + (b.month - a.month) * 30 + (d2 - d1);
};
export const addThirty360Days = (d: CalcDate, days: number): CalcDate => {
  const total = d.year * 360 + (d.month - 1) * 30 + Math.min(d.day, 30) + days;
  const year = Math.floor(total / 360); const rem = total - year * 360;
  return { year, month: Math.floor(rem / 30) + 1, day: rem % 30 || 30 };
};
