import { describe, expect, it } from 'vitest';
import { DefaultState } from '../state';
import { reduceScientific, sqrtOp, powerOp } from './scientific';
import { SecondaryFunction } from '../../keypad/secondary-function-map';
import { dispatchVirtualKey, dispatchKey } from '../../../lib/engine/dispatcher';
import { KeyId } from '../../keypad/key-id';
const state = (value: number) => ({ ...DefaultState, display: { ...DefaultState.display, value, entry: String(value) } });
describe('scientific reducer', () => {
  it('computes scientific operations and domain errors', () => {
    expect(sqrtOp(state(9)).display.value).toBe(3);
    expect(sqrtOp(state(-1)).error).toBe(2);
    expect(powerOp(2, 3)).toBe(8);
    expect(reduceScientific(state(4), SecondaryFunction.SQUARE).display.value).toBe(16);
    expect(reduceScientific(state(0), SecondaryFunction.RECIPROCAL).error).toBe(2);
    expect(reduceScientific(state(Math.E), SecondaryFunction.LN).display.value).toBeCloseTo(1);
    expect(reduceScientific(state(0), SecondaryFunction.LN).error).toBe(2);
    expect(reduceScientific(state(2), SecondaryFunction.EXP).display.value).toBeCloseTo(Math.exp(2));
    expect(reduceScientific(state(100), SecondaryFunction.LOG).display.value).toBe(2);
    expect(reduceScientific(state(2), SecondaryFunction.TEN_X).display.value).toBe(100);
    expect(reduceScientific(state(5), SecondaryFunction.FACTORIAL).display.value).toBe(120);
    expect(reduceScientific(state(2.5), SecondaryFunction.FACTORIAL).error).toBe(2);
  });
});
describe('chassis virtual-id routing for scientific row (REQ-007)', () => {
  it('V_RECIP computes 1/x on the current display value', () => {
    const out = dispatchVirtualKey(state(4), 'V_RECIP');
    expect(out.reducerId).toBe('sci');
    expect(out.state.display.value).toBe(0.25);
  });
  it('V_RECIP on zero raises a domain error', () => {
    const out = dispatchVirtualKey(state(0), 'V_RECIP');
    expect(out.state.error).toBe(2);
  });
  it('V_LN computes ln(x); ln(100) ≈ 4.6052', () => {
    const out = dispatchVirtualKey(state(100), 'V_LN');
    expect(out.reducerId).toBe('sci');
    expect(out.state.display.value).toBeCloseTo(Math.log(100), 6);
    expect(out.state.display.value).toBeCloseTo(4.605170, 5);
  });
  it('V_LN on non-positive raises a domain error', () => {
    expect(dispatchVirtualKey(state(0), 'V_LN').state.error).toBe(2);
    expect(dispatchVirtualKey(state(-1), 'V_LN').state.error).toBe(2);
  });
  it('V_YX behaves as binary y^x: 2 yˣ 3 = → 8', () => {
    // Enter 2, press V_YX, enter 3, press EQUALS — expect 8.
    let s = DefaultState;
    s = dispatchKey(s, KeyId.D2).state;
    s = dispatchVirtualKey(s, 'V_YX').state;
    s = dispatchKey(s, KeyId.D3).state;
    s = dispatchKey(s, KeyId.EQUALS).state;
    expect(s.display.value).toBe(8);
  });
  it('unknown virtual ids no-op cleanly', () => {
    const out = dispatchVirtualKey(DefaultState, 'V_BOGUS');
    expect(out.reducerId).toBe('noop');
    expect(out.state).toEqual(DefaultState);
  });
});
