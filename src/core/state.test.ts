import { describe, expect, it } from 'vitest';
import { DefaultState } from './state';

describe('DefaultState', () => {
  it('matches BA II Plus defaults', () => {
    expect(DefaultState.mode).toBe('standard');
    expect(DefaultState.tvm.timing).toBe('END');
    expect(DefaultState.format.decimalPlaces).toBe(2);
    expect(DefaultState.tvm.PY).toBe(1);
    expect(DefaultState.tvm.CY).toBe(1);
    expect(DefaultState.format.angleMode).toBe('DEG');
    expect(DefaultState.display.value).toBe(0);
    expect(Object.values(DefaultState.memory)).toEqual(Array(10).fill(0));
    expect(DefaultState.secondLatched).toBe(false);
    expect(DefaultState.error).toBeNull();
  });
});
