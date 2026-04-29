import { type CalcResult, ok, err } from '../errors';
export const pb = (cashflows: number[]): CalcResult<number> => {
  let cumulative = cashflows[0] ?? 0;
  if (cumulative >= 0) return ok(0);
  for (let i = 1; i < cashflows.length; i += 1) {
    const prev = cumulative;
    cumulative += cashflows[i];
    if (cumulative >= 0) return ok(i - 1 + (-prev / cashflows[i]));
  }
  return err(5);
};
