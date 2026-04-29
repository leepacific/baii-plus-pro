import { type CalcResult, ok, err } from '../../src/core/errors';
export const checkSignConvention = (...values: number[]): CalcResult<true> => {
  const nonZero = values.filter((v) => v !== 0);
  if (nonZero.length === 0) return err(5);
  const hasPos = nonZero.some((v) => v > 0);
  const hasNeg = nonZero.some((v) => v < 0);
  return hasPos && hasNeg ? ok(true) : err(5);
};
