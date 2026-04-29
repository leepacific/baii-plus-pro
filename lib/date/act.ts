import { type CalcDate } from './parse';
export const toUtc = (d: CalcDate): number => Date.UTC(d.year, d.month - 1, d.day);
export const actDayCount = (a: CalcDate, b: CalcDate): number => Math.round((toUtc(b) - toUtc(a)) / 86400000);
export const addActualDays = (d: CalcDate, days: number): CalcDate => { const dt = new Date(toUtc(d) + days * 86400000); return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() }; };
