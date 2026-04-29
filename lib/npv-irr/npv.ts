export interface CashflowTerm { value: number; frequency: number }
export const expandCashflows = (cashflows: CashflowTerm[]): number[] => cashflows.flatMap((cf, index) => index === 0 ? [cf.value] : Array.from({ length: cf.frequency }, () => cf.value));
export const npv = (ratePercent: number, cashflows: CashflowTerm[]): number => {
  const rate = ratePercent / 100;
  return expandCashflows(cashflows).reduce((sum, cf, t) => sum + cf / (1 + rate) ** t, 0);
};
