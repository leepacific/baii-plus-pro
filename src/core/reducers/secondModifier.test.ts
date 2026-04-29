import { describe, expect, it } from 'vitest';
import { DefaultState } from '../state';
import { KeyId } from '../../keypad/key-id';
import { SecondaryFunction } from '../../keypad/secondary-function-map';
import { reduceSecondModifier } from './secondModifier';
describe('2ND modifier', () => {
  it('latches, cancels, and fires once', () => {
    const latched = reduceSecondModifier(DefaultState, KeyId.SECOND).state;
    expect(latched.secondLatched).toBe(true);
    expect(reduceSecondModifier(latched, KeyId.SECOND).state.secondLatched).toBe(false);
    const fired = reduceSecondModifier(latched, KeyId.D2);
    expect(fired.secondary).toBe(SecondaryFunction.CF);
    expect(fired.state.secondLatched).toBe(false);
  });
});
