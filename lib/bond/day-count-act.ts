export interface BondDate { year: number; month: number; day: number }
const utc = (d: BondDate) => Date.UTC(d.year, d.month - 1, d.day);
export const dayCountAct = (a: BondDate, b: BondDate) => ({ days: Math.round((utc(b) - utc(a)) / 86400000), basis: 365 + (new Date(utc(a)).getUTCFullYear() % 4 === 0 ? 1 : 0) });
