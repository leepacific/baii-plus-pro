import { describe, expect, it } from 'vitest';
import { DefaultState } from '../../src/core/state';
import { KeyId } from '../../src/keypad/key-id';
import { dispatchKey } from './dispatcher';
import { reduceSecondState } from './second-modifier';
import { preserveFormat } from './format-integration';
import { emitSitemap } from './sitemap-emitter';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
describe('engine dispatch layer', () => {
  it('dispatches deterministically and preserves format', () => {
    for (const key of Object.values(KeyId)) expect(dispatchKey(DefaultState, key).reducerId).toBeTruthy();
    expect(reduceSecondState({ secondLatched: false }, KeyId.SECOND).state.secondLatched).toBe(true);
    expect(reduceSecondState({ secondLatched: true }, KeyId.SECOND).transition.type).toBe('cancel');
    expect(preserveFormat(DefaultState, { ...DefaultState, format: { decimalPlaces: 4, notationMode: 'ENG', angleMode: 'RAD' } }).format).toEqual(DefaultState.format);
  });
  it('emits sitemap with fixed localhost base URL', () => {
    const out = join(mkdtempSync(join(tmpdir(), 'sitemap-')), 'sitemap.yaml');
    emitSitemap(out);
    expect(existsSync(out)).toBe(true);
    expect(readFileSync(out, 'utf8')).toContain('base_url: http://localhost:3000');
  });
  it('toggles BGN/END timing on 2ND+ARROW_UP (REQ-010)', () => {
    let s = DefaultState;
    expect(s.tvm.timing).toBe('END');
    s = dispatchKey(s, KeyId.SECOND).state;
    s = dispatchKey(s, KeyId.ARROW_UP).state;
    expect(s.tvm.timing).toBe('BGN');
    s = dispatchKey(s, KeyId.SECOND).state;
    s = dispatchKey(s, KeyId.ARROW_UP).state;
    expect(s.tvm.timing).toBe('END');
  });
  it('runs scientific secondary functions through 2ND prefix (REQ-007)', () => {
    // 2ND+SQRT → SQUARE: enter 8.1, then 2ND+SQRT → 65.61.
    let s = { ...DefaultState, display: { ...DefaultState.display, value: 8.1, entry: '8.1' } };
    s = dispatchKey(s, KeyId.SECOND).state;
    s = dispatchKey(s, KeyId.SQRT).state;
    expect(s.display.value).toBeCloseTo(65.61, 6);
    // 2ND+POWER → RECIPROCAL: enter 4, then 2ND+POWER → 0.25.
    s = { ...DefaultState, display: { ...DefaultState.display, value: 4, entry: '4' } };
    s = dispatchKey(s, KeyId.SECOND).state;
    s = dispatchKey(s, KeyId.POWER).state;
    expect(s.display.value).toBe(0.25);
  });
  it('CPT is a modifier — sets cptPending without computing (REQ-009)', () => {
    // After CPT alone, the LCD does not change to a solved value; the flag
    // is set and waits for the next TVM-register key.
    const before = { ...DefaultState, display: { ...DefaultState.display, value: 1234, entry: '1234' } };
    const after = dispatchKey(before, KeyId.CPT).state;
    expect(after.tvm.cptPending).toBe(true);
    expect(after.display.value).toBe(1234); // unchanged
  });
  it('canonical CFA TVM sequence: 6 N 5 I/Y 1000 PV 0 FV CPT PMT solves for PMT (REQ-009)', () => {
    // Sequence simulates the full keypad-side flow: digits → register key.
    // This tests both the digit-concatenation reset (commitTvmRegister
    // resetting entry) and the CPT-pending semantic.
    let s = DefaultState;
    // 6 N
    s = dispatchKey(s, KeyId.D6).state;
    s = dispatchKey(s, KeyId.N).state;
    expect(s.tvm.N).toBe(6);
    // 5 I/Y
    s = dispatchKey(s, KeyId.D5).state;
    s = dispatchKey(s, KeyId.I_Y).state;
    expect(s.tvm.IY).toBe(5);
    // 1000 PV
    s = dispatchKey(s, KeyId.D1).state;
    s = dispatchKey(s, KeyId.D0).state;
    s = dispatchKey(s, KeyId.D0).state;
    s = dispatchKey(s, KeyId.D0).state;
    s = dispatchKey(s, KeyId.PV).state;
    expect(s.tvm.PV).toBe(1000);
    // 0 FV
    s = dispatchKey(s, KeyId.D0).state;
    s = dispatchKey(s, KeyId.FV).state;
    expect(s.tvm.FV).toBe(0);
    // CPT (sets cptPending; does NOT compute yet)
    s = dispatchKey(s, KeyId.CPT).state;
    expect(s.tvm.cptPending).toBe(true);
    // PMT (CPT-pending → solve for PMT)
    s = dispatchKey(s, KeyId.PMT).state;
    expect(s.tvm.cptPending).toBe(false);
    // BA II Plus Pro guidebook example with default PY=CY=1: PMT ≈ -197.02
    // (negative per the cash-flow sign convention — outflow per period).
    expect(s.display.value).toBeCloseTo(-197.017, 2);
    expect(s.tvm.PMT).toBeCloseTo(-197.017, 2);
  });
  it('CPT followed by FV solves for FV using the four other registers (REQ-009)', () => {
    // After the PMT solve above, set FV=null and ask for FV.
    let s = DefaultState;
    s = { ...s, tvm: { ...s.tvm, N: 6, IY: 5, PV: 1000, PMT: -197.017, FV: null } };
    s = dispatchKey(s, KeyId.CPT).state;
    s = dispatchKey(s, KeyId.FV).state;
    expect(s.tvm.cptPending).toBe(false);
    // Round-trip: solving FV with the just-solved PMT should land back near 0.
    expect(Math.abs(s.display.value)).toBeLessThan(0.05);
  });
  it('cptPending is cleared by any non-TVM-register, non-CPT keypress', () => {
    let s = { ...DefaultState, tvm: { ...DefaultState.tvm, cptPending: true } };
    s = dispatchKey(s, KeyId.D5).state;
    expect(s.tvm.cptPending).toBe(false);
  });
});
