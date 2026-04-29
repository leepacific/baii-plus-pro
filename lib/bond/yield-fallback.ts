import { type BondState } from './accrued-interest';
import { bondPrice } from './price';
export const yieldFallback = (s: BondState, targetPrice: number): number | null => {
  let lo = 0, hi = 100, flo = bondPrice(s, lo) - targetPrice;
  if (Math.sign(flo) === Math.sign(bondPrice(s, hi) - targetPrice)) return null;
  for (let i = 0; i < 80; i += 1) { const mid = (lo + hi) / 2; const fm = bondPrice(s, mid) - targetPrice; if (Math.abs(fm) < 1e-8) return mid; if (Math.sign(flo) === Math.sign(fm)) { lo = mid; flo = fm; } else hi = mid; }
  return (lo + hi) / 2;
};
