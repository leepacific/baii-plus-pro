import { describe, expect, it } from 'vitest';
import { mirr } from './mirr';
import { nfv } from './nfv';
import { pb } from './pb';
import { dpb } from './dpb';

describe('cash-flow extensions', () => {
  it('computes MIRR, NFV, PB, DPB identities', () => {
    expect(mirr(10, 12, [-1000, 300, 420, 680])).toBeCloseTo(15.147, 3);
    expect(nfv(0, [-100, 60, 60])).toBe(20);
    expect(nfv(10, [-100, 60, 60])).toBeCloseTo(5);
    const payback = pb([-100, 40, 40, 40]);
    expect(payback.ok ? payback.value : null).toBeCloseTo(2.5);
    expect(pb([-100, 10]).ok).toBe(false);
    expect(dpb(0, [-100, 40, 40, 40])).toEqual(pb([-100, 40, 40, 40]));
  });
});
