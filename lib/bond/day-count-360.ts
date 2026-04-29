import { type BondDate } from './day-count-act';
export const dayCount360 = (a: BondDate, b: BondDate) => ({ days: (b.year-a.year)*360 + (b.month-a.month)*30 + (Math.min(b.day,30)-Math.min(a.day,30)), basis: 360 });
