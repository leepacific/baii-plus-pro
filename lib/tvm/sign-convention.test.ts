import { describe, expect, it } from 'vitest';
import { checkSignConvention } from './sign-convention';
import { solveFV } from './solve-fv';
import { solvePV } from './solve-pv';
import { solvePMT } from './solve-pmt';
import { solveN } from './solve-n';
import { solveIY } from './solve-iy';
import { periodicRate } from './py-field';
import { effectiveRate } from './cy-field';
import { paymentShiftFactor, toggleTimingMode } from './timing-mode';

describe('TVM primitives', () => {
  it('solves closed-form TVM variables and helpers', () => {
    const base = { N: 12, IY: 12, PV: 1000, PMT: -88.8487886783416, FV: 0, PY: 12, CY: 12, timing: 'END' as const };
    const withoutPmt = { N: base.N, IY: base.IY, PV: base.PV, FV: base.FV, PY: base.PY, CY: base.CY, timing: base.timing };
    const withoutPv = { N: base.N, IY: base.IY, PMT: base.PMT, FV: base.FV, PY: base.PY, CY: base.CY, timing: base.timing };
    const withoutFv = { N: base.N, IY: base.IY, PV: base.PV, PMT: base.PMT, PY: base.PY, CY: base.CY, timing: base.timing };
    const withoutN = { IY: base.IY, PV: base.PV, PMT: base.PMT, FV: base.FV, PY: base.PY, CY: base.CY, timing: base.timing };
    const withoutIy = { N: base.N, PV: base.PV, PMT: base.PMT, FV: base.FV, PY: base.PY, CY: base.CY, timing: base.timing };
    expect(solvePMT(withoutPmt)).toBeCloseTo(base.PMT, 8);
    expect(solvePV(withoutPv)).toBeCloseTo(base.PV, 8);
    expect(solveFV(withoutFv)).toBeCloseTo(0, 8);
    expect(solveN(withoutN)).toBeCloseTo(12, 6);
    expect(solveIY(withoutIy)).toBeCloseTo(12, 5);
    expect(periodicRate(12, 12, 12)).toBeCloseTo(0.01);
    expect(effectiveRate(12, 12, 12)).toBeCloseTo(0.01);
    expect(paymentShiftFactor(0.01, 'BGN')).toBeCloseTo(1.01);
    expect(toggleTimingMode({ timing: 'END' }).timing).toBe('BGN');
  });
  it('guards sign convention', () => {
    expect(checkSignConvention(1, 2).ok).toBe(false);
    expect(checkSignConvention(-1, -2).ok).toBe(false);
    expect(checkSignConvention(-1, 2).ok).toBe(true);
  });
});
