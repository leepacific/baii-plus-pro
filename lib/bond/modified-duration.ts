import { type BondState } from './accrued-interest';
import { bondPrice } from './price';
export const modifiedDuration = (s: BondState, yld: number): number => {
  const delta = 0.01; return (bondPrice(s, yld - delta) - bondPrice(s, yld + delta)) / (2 * bondPrice(s, yld) * delta / 100);
};
