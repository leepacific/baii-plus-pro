import { describe, expect, it } from 'vitest';
import { balanceAt } from './bal';
import { principalPaid } from './prn';
import { interestPaid } from './int';
import { validateAmortRange } from './validate';
import { initialAmortState, moveAmortFocus } from './reducer';
import { verifyAmortIdentity } from './identity-verifier';
const s = { N: 12, IY: 12, PV: 1000, PMT: -88.8487886783416, FV: 0, PY: 12, CY: 12, timing: 'END' as const };
describe('amortization', () => {
  it('computes BAL, PRN, INT and verifies identities', () => {
    expect(balanceAt(s, 0)).toBe(1000);
    expect(balanceAt(s, 12)).toBeCloseTo(0, 6);
    expect(principalPaid(s, 1, 1)).toBeCloseTo(78.848788678, 6);
    expect(interestPaid(s, 1, 1)).toBeCloseTo(-167.697577356, 6);
    const validRange = validateAmortRange(2, 1, 12);
    expect(validRange.ok ? validRange.value.P2 : null).toBe(2);
    expect(validateAmortRange(0, 1, 12).ok).toBe(false);
    expect(moveAmortFocus(initialAmortState(), 'down').focus).toBe('P2');
    expect(verifyAmortIdentity(s, 1).ok).toBe(true);
  });
});
