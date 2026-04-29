import { npv, type CashflowTerm } from './npv';
export type IrrBracketResult = { type: 'converged'; rate: number } | { type: 'no-bracket' };
export const irrBracket = (cashflows: CashflowTerm[]): IrrBracketResult => {
  const ladder = [-99, -90, -75, -50, -25, -10, 0, 5, 10, 25, 50, 100, 250, 500, 1000];
  for (let i = 0; i < ladder.length - 1; i += 1) {
    let lo = ladder[i], hi = ladder[i + 1], flo = npv(lo, cashflows), fhi = npv(hi, cashflows);
    if (Math.sign(flo) === Math.sign(fhi)) continue;
    for (let j = 0; j < 80; j += 1) {
      const mid = (lo + hi) / 2; const fm = npv(mid, cashflows);
      if (Math.abs(fm) < 1e-10) return { type: 'converged', rate: mid };
      if (Math.sign(flo) === Math.sign(fm)) { lo = mid; flo = fm; } else { hi = mid; fhi = fm; }
    }
    void fhi;
    return { type: 'converged', rate: (lo + hi) / 2 };
  }
  return { type: 'no-bracket' };
};
