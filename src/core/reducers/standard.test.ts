import { describe, expect, it } from 'vitest';
import { DefaultState } from '../state';
import { KeyId } from '../../keypad/key-id';
import { reduceStandard } from './standard';
const run = (keys: KeyId[]) => keys.reduce(reduceStandard, DefaultState);
describe('standard reducer', () => {
  it('supports chain arithmetic entry', () => {
    expect(run([KeyId.D1, KeyId.PLUS, KeyId.D2, KeyId.EQUALS]).display.value).toBe(3);
    expect(run([KeyId.D1, KeyId.D0, KeyId.MINUS, KeyId.D3, KeyId.EQUALS]).display.value).toBe(7);
    expect(run([KeyId.D2, KeyId.MULTIPLY, KeyId.D3, KeyId.PLUS, KeyId.D4, KeyId.EQUALS]).display.value).toBe(10);
    expect(run([KeyId.D8, KeyId.DIVIDE, KeyId.D2, KeyId.EQUALS]).display.value).toBe(4);
    expect(run([KeyId.D5, KeyId.SIGN]).display.value).toBe(-5);
  });
  it('handles primary scientific keys (REQ-007)', () => {
    // Primary √x: enter 81 then SQRT → 9.
    expect(run([KeyId.D8, KeyId.D1, KeyId.SQRT]).display.value).toBe(9);
    // Primary y^x (POWER as binary): 2 ^ 3 = 8.
    expect(run([KeyId.D2, KeyId.POWER, KeyId.D3, KeyId.EQUALS]).display.value).toBe(8);
    // Grouping with parentheses: (2 + 3) * 4 = 20.
    expect(run([
      KeyId.LPAREN, KeyId.D2, KeyId.PLUS, KeyId.D3, KeyId.RPAREN,
      KeyId.MULTIPLY, KeyId.D4, KeyId.EQUALS,
    ]).display.value).toBe(20);
    // SQRT of negative number raises error 2.
    expect(run([KeyId.D5, KeyId.SIGN, KeyId.SQRT]).error).toBe(2);
  });
});
