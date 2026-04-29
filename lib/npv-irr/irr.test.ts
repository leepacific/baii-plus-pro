import { describe, expect, it } from 'vitest';
import { npv } from './npv';
import { irrNewton } from './irr-newton';
import { irrBracket } from './irr-bracket';
import { irr } from './irr';
const flows = [{ value: -1000, frequency: 1 }, { value: 400, frequency: 1 }, { value: 400, frequency: 1 }, { value: 400, frequency: 1 }];
describe('NPV and IRR', () => {
  it('computes NPV and IRR through Newton/fallback orchestration', () => {
    expect(npv(10, flows)).toBeCloseTo(-5.259, 3);
    expect(irrNewton(flows).type).toBe('converged');
    expect(irrBracket(flows).type).toBe('converged');
    const r = irr(flows);
    expect(r.ok && npv(r.value, flows)).toBeCloseTo(0, 8);
  });
});
