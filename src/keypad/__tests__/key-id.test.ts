import { describe, expect, it } from 'vitest';
import { KeyId } from '../key-id';
const expected = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "DECIMAL", "SIGN", "PLUS", "MINUS", "MULTIPLY", "DIVIDE", "EQUALS", "N", "I_Y", "PV", "PMT", "FV", "CPT", "SECOND", "ENTER", "ARROW_UP", "ARROW_DOWN", "CE_C", "ON_OFF", "STO", "RCL", "POWER", "SQRT", "LPAREN", "RPAREN"];
describe('KeyId', () => {
  it('contains exactly the 35 primary keys in order', () => {
    expect(Object.keys(KeyId)).toEqual(expected);
    expect(Object.keys(KeyId)).toHaveLength(35);
    expect(Object.keys(KeyId)).not.toContain('SET');
    expect(Object.keys(KeyId)).not.toContain('RECIPROCAL');
  });
});
