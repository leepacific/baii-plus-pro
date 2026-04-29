import { type CalcResult, ok, err } from '../../src/core/errors';
export const validateFrequency = (value: number): CalcResult<number> => Number.isInteger(value) && value > 0 ? ok(value) : err(4);
