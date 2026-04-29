import { expect, it } from 'vitest';
import { editStat1Slot, initialStat1State } from './reducer';
import { requireNonEmpty, requireNonNegativeFreq } from './errors';
import { computeN } from './n';
import { computeMean } from './mean';
import { computeSx } from './sx';
import { computeSigmaX } from './sigma-x';
import { computeSumX } from './sum-x';
import { computeSumX2 } from './sum-x2';
it('computes 1-var statistics and guards errors', () => {
  let s = editStat1Slot(initialStat1State(), 2, 1); s = { ...s, cursor: 1 }; s = editStat1Slot(s, 4, 1);
  expect(computeN(s.slots)).toBe(2); expect(computeMean(s.slots)).toBe(3); expect(computeSx(s.slots)).toBeCloseTo(Math.SQRT2); expect(computeSigmaX(s.slots)).toBe(1); expect(computeSumX(s.slots)).toBe(6); expect(computeSumX2(s.slots)).toBe(20);
  expect(requireNonEmpty(initialStat1State().slots).ok).toBe(false);
  expect(requireNonNegativeFreq([{ x: 1, y: 0 }]).ok).toBe(false);
});
