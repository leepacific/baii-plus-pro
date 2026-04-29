import { describe, expect, it } from 'vitest';
import { DefaultState } from '../state';
import { KeyId } from '../../keypad/key-id';
import { commitTvmRegister, computeTvm } from './tvm';
const withDisplay = (v: number) => ({ ...DefaultState, display: { ...DefaultState.display, value: v, entry: String(v) } });
describe('TVM reducer', () => {
  it('commits registers and computes a payment', () => {
    let s = commitTvmRegister(withDisplay(12), KeyId.N);
    s = commitTvmRegister({ ...s, display: { ...s.display, value: 12 } }, KeyId.I_Y);
    s = commitTvmRegister({ ...s, display: { ...s.display, value: 1000 } }, KeyId.PV);
    s = commitTvmRegister({ ...s, display: { ...s.display, value: 0 } }, KeyId.FV);
    s = { ...s, tvm: { ...s.tvm, PY: 12, CY: 12, lastTvmKey: 'PMT' } };
    expect(computeTvm(s).display.value).toBeCloseTo(-88.848788678, 6);
  });
  it('resets entry buffer after register commit so next digits do not concatenate (REQ-009)', () => {
    // Simulate "10 N 5" — typing 10, pressing N, then typing 5.
    let s = withDisplay(10);
    // After commit, entry should be reset to '0' so that subsequent digit
    // entries via the standard reducer start fresh rather than appending.
    s = commitTvmRegister(s, KeyId.N);
    expect(s.display.entry).toBe('0');
    expect(s.tvm.N).toBe(10);
  });
});
