import { type BondState } from './accrued-interest';
import { bondPrice } from './price';
export const yieldNewton = (s: BondState, targetPrice: number): number => {
  let y = s.CPN;
  for (let i = 0; i < 64; i += 1) { const f = bondPrice(s, y) - targetPrice; if (Math.abs(f) < 1e-8) return y; const d = (bondPrice(s, y + 1e-4) - bondPrice(s, y - 1e-4)) / 2e-4; y -= f / d; }
  return Number.NaN;
};
