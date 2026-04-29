import { balanceAt, type AmortTvmState } from './bal';
import { principalPaid } from './prn';
import { interestPaid } from './int';
export type AmortIdentityResult = { ok: true } | { ok: false; n: number; balanceResidual: number; paymentResidual: number };
export const verifyAmortIdentity = (s: AmortTvmState, n: number): AmortIdentityResult => {
  const balResidual = balanceAt(s, n) - (balanceAt(s, n - 1) - principalPaid(s, n, n));
  const payResidual = interestPaid(s, n, n) + principalPaid(s, n, n) - s.PMT;
  return Math.abs(balResidual) < 1e-8 && Math.abs(payResidual) < 1e-8 ? { ok: true } : { ok: false, n, balanceResidual: balResidual, paymentResidual: payResidual };
};
