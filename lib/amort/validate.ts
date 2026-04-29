import { type CalcResult, ok, err } from '../../src/core/errors';
export interface AmortRange { P1: number; P2: number }
export const validateAmortRange = (P1: number, P2: number, N: number): CalcResult<AmortRange> => {
  if (![P1, P2, N].every(Number.isInteger) || P1 < 1 || P2 < 1 || N < 1 || P1 > N || P2 > N) return err(4);
  return ok({ P1, P2: Math.max(P1, P2) });
};
