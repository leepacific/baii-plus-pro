import { describe, expect, it } from 'vitest';
import { commitCashflowValue, commitFrequency, initialCfState } from './reducer';
import { insertCashflow } from './insert';
import { deleteCashflow } from './delete';
import { validateFrequency } from './frequency';
import { moveCfFocus } from './navigate';
import { prunedCashflows } from './prune';

describe('cash-flow worksheet scaffold', () => {
  it('commits values, shifts rows, validates frequency, navigates, and prunes', () => {
    let s = commitCashflowValue(initialCfState(), 0, -100);
    s = commitCashflowValue(s, 1, 50);
    s = commitFrequency(s, 1, 2);
    expect(s.cf0).toBe(-100);
    expect(s.slots[0]).toEqual({ value: 50, frequency: 2 });
    expect(insertCashflow(s, 1).slots[1].value).toBe(50);
    expect(deleteCashflow(insertCashflow(s, 1), 1).slots[0].value).toBe(50);
    expect(validateFrequency(2).ok).toBe(true);
    expect(validateFrequency(0).ok).toBe(false);
    expect(moveCfFocus('CF0', 'down')).toBe('CF01');
    expect(prunedCashflows(s)).toHaveLength(2);
  });
});
