import { npv } from '../../../lib/npv-irr/npv';
export const nfv = (discountRatePercent: number, cashflows: number[]): number => npv(discountRatePercent, cashflows.map((value, i) => ({ value, frequency: i === 0 ? 1 : 1 }))) * (1 + discountRatePercent / 100) ** (cashflows.length - 1);
