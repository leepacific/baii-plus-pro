import { type ProfitError } from './errors';
export const solveSel = (cst: number, mar: number): number | ProfitError => mar === 100 ? { type: 'margin-is-100', code: 2 } : cst / (1 - mar / 100);
