import { expect, it } from 'vitest';
import { isProfitError } from './errors';
import { editProfitField, initialProfitState } from './reducer';
import { solveCst } from './solve-cst';
import { solveSel } from './solve-sel';
import { solveMar } from './solve-mar';
it('solves PROFIT fields and errors on MAR=100', () => {
  expect(editProfitField(initialProfitState(), 'CST', 80).CST).toBe(80);
  expect(solveCst(100, 20)).toBe(80);
  expect(solveSel(80, 20)).toBe(100);
  expect(solveMar(80, 100)).toBeCloseTo(20);
  expect(isProfitError(solveSel(80, 100))).toBe(true);
});
