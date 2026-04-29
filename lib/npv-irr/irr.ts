import { type CalcResult, ok, err } from '../../src/core/errors';
import { type CashflowTerm } from './npv';
import { irrNewton } from './irr-newton';
import { irrBracket } from './irr-bracket';
export const irr = (cashflows: CashflowTerm[]): CalcResult<number> => {
  const n = irrNewton(cashflows);
  if (n.type === 'converged') return ok(n.rate);
  const b = irrBracket(cashflows);
  return b.type === 'converged' ? ok(b.rate) : err(7);
};
