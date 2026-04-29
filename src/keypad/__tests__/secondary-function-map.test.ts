import { describe, expect, it } from 'vitest';
import { KeyId } from '../key-id';
import { SECONDARY_FUNCTION_MAP, SecondaryFunction } from '../secondary-function-map';

describe('secondary function map', () => {
  it('is total over every physical key and resolves cited mappings', () => {
    expect(Object.keys(SECONDARY_FUNCTION_MAP)).toHaveLength(35);
    expect(Object.keys(SECONDARY_FUNCTION_MAP)).toEqual(Object.keys(KeyId));
    expect(SECONDARY_FUNCTION_MAP[KeyId.PMT]).toBe(SecondaryFunction.AMORT);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D2]).toBe(SecondaryFunction.CF);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D3]).toBe(SecondaryFunction.NPV);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D4]).toBe(SecondaryFunction.IRR);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D5]).toBe(SecondaryFunction.BOND);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D6]).toBe(SecondaryFunction.DEPR);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D7]).toBe(SecondaryFunction.DATE);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D8]).toBe(SecondaryFunction.ICONV);
    expect(SECONDARY_FUNCTION_MAP[KeyId.D9]).toBe(SecondaryFunction.STAT);
    expect(SECONDARY_FUNCTION_MAP[KeyId.DECIMAL]).toBe(SecondaryFunction.FORMAT);
    expect(SECONDARY_FUNCTION_MAP[KeyId.ARROW_UP]).toBe(SecondaryFunction.BGN);
    expect(SECONDARY_FUNCTION_MAP[KeyId.ENTER]).toBe(SecondaryFunction.SET);
    expect(SECONDARY_FUNCTION_MAP[KeyId.CE_C]).toBe(SecondaryFunction.CLR_WORK);
  });
});
