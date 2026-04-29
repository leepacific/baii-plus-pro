import { type CalcDate } from './parse';
export const isLeapYear = (year: number): boolean => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
export const daysInMonth = (year: number, month: number): number => [31, isLeapYear(year) ? 29 : 28, 31,30,31,30,31,31,30,31,30,31][month - 1] ?? 0;
export const validateDate = (d: CalcDate) => Number.isInteger(d.year) && d.month >= 1 && d.month <= 12 && d.day >= 1 && d.day <= daysInMonth(d.year, d.month) ? { ok: true as const, value: d } : { ok: false as const, error: 8 as const };
