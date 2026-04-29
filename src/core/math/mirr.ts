export const mirr = (financeRatePercent: number, reinvestRatePercent: number, cashflows: number[]): number => {
  const f = financeRatePercent / 100; const r = reinvestRatePercent / 100; const n = cashflows.length - 1;
  const pvNeg = cashflows.reduce((sum, cf, i) => cf < 0 ? sum + cf / (1 + f) ** i : sum, 0);
  const fvPos = cashflows.reduce((sum, cf, i) => cf > 0 ? sum + cf * (1 + r) ** (n - i) : sum, 0);
  return ((fvPos / -pvNeg) ** (1 / n) - 1) * 100;
};
