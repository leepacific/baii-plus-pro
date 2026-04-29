import { expect, it } from 'vitest';
import { sl } from './sl';
import { syd } from './syd';
import { db } from './db';
import { dbx } from './dbx';
import { slf } from './slf';
import { dbf } from './dbf';
import { prorateAmount } from './proration';
import { editDeprField, initialDeprState } from './reducer';
it('computes depreciation methods', () => {
  expect(sl(1000, 100, 3, 3).RBV).toBe(100);
  expect(syd(1000, 100, 3, 1).DEP).toBe(450);
  expect(db(1000, 100, 5, 200, 5).RBV).toBeGreaterThanOrEqual(100);
  expect(dbx(1000, 100, 5, 200, 5).RBV).toBeCloseTo(100);
  expect(slf(1200, 0, 3, 7, 1).DEP).toBe(200);
  expect(dbf(1000, 100, 5, 200, 7, 1).DEP).toBeCloseTo(200);
  expect(prorateAmount(120, 7)).toEqual({ firstYear: 60, trailingYear: 60 });
  expect(editDeprField(initialDeprState(), 'CST', 10).CST).toBe(10);
});
