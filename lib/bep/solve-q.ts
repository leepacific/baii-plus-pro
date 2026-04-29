import { type BreakevenError } from './errors';
export const solveQ = (fc: number, vc: number, p: number, pft: number): number | BreakevenError => p === vc ? { type: 'zero-contribution-margin', code: 2 } : (fc + pft) / (p - vc);
