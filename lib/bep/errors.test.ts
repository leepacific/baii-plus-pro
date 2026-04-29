import { expect, it } from 'vitest';
import { isBreakevenError } from './errors';
import { editBreakevenField, initialBreakevenState } from './reducer';
import { solveFc } from './solve-fc';
import { solveVc } from './solve-vc';
import { solveP } from './solve-p';
import { solvePft } from './solve-pft';
import { solveQ } from './solve-q';
it('solves breakeven fields and errors on zero margin', () => {
  expect(editBreakevenField(initialBreakevenState(), 'FC', 100).FC).toBe(100);
  expect(solveFc(2, 5, 100, 100)).toBe(200);
  expect(solveVc(200, 5, 100, 100)).toBe(2);
  expect(solveP(200, 2, 100, 100)).toBe(5);
  expect(solvePft(200, 2, 5, 100)).toBe(100);
  expect(solveQ(200, 2, 5, 100)).toBe(100);
  expect(isBreakevenError(solveQ(1, 2, 2, 3))).toBe(true);
});
