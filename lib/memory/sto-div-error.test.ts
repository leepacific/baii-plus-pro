import { describe, expect, it } from 'vitest';
import { initialMemoryState } from './state';
import { sto } from './sto';
import { rcl } from './rcl';
import { stoAdd } from './sto-add';
import { stoSub } from './sto-sub';
import { stoMul } from './sto-mul';
import { stoDiv } from './sto-div';
import { stoDivOrError } from './sto-div-error';

describe('memory operations', () => {
  it('initializes and updates registers immutably', () => {
    const s0 = initialMemoryState();
    expect(Object.values(s0)).toEqual(Array(10).fill(0));
    const s1 = sto(s0, 3, 8);
    expect(rcl(s1, 3)).toBe(8);
    expect(rcl(stoAdd(s1, 3, 2), 3)).toBe(10);
    expect(rcl(stoSub(s1, 3, 2), 3)).toBe(6);
    expect(rcl(stoMul(s1, 3, 2), 3)).toBe(16);
    expect(rcl(stoDiv(s1, 3, 2), 3)).toBe(4);
  });
  it('reports Error 2 on divide by zero', () => {
    const s0 = sto(initialMemoryState(), 1, 5);
    const result = stoDivOrError(s0, 1, 0);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(2);
    expect(result.state).toEqual(s0);
  });
});
