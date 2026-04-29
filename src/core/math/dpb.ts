import { pb } from './pb';
export const dpb = (discountRatePercent: number, cashflows: number[]) => pb(cashflows.map((cf, i) => cf / (1 + discountRatePercent / 100) ** i));
