import { expect, it } from 'vitest';
import { createEngine } from './index';
import { KeyId } from '../keypad/key-id';
import { DefaultState } from '../core/state';
it('exposes public engine API', () => {
  const engine = createEngine();
  expect(engine.getState()).toEqual(DefaultState);
  engine.pressKey(KeyId.D5); expect(engine.getDisplay()).toBe('5');
  engine.pressKey(KeyId.SECOND); expect(engine.getState().secondLatched).toBe(true);
});
it('setDisplayValue surfaces recalled values to the LCD pipeline (REQ-021)', () => {
  const engine = createEngine();
  engine.setDisplayValue(42);
  expect(engine.getState().display.value).toBe(42);
  expect(engine.getDisplay()).toContain('42');
});
