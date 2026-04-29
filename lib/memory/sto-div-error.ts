import { type MemoryState, slotName } from './state';
export type StoDivError = { type: 'divide-by-zero'; code: 2 };
export type StoDivResult = { ok: true; state: MemoryState } | { ok: false; error: StoDivError; state: MemoryState };
export const isStoDivError = (value: unknown): value is StoDivError => typeof value === 'object' && value !== null && (value as StoDivError).code === 2;
export const stoDivOrError = (state: MemoryState, slot: number, value: number): StoDivResult => {
  if (value === 0) return { ok: false, error: { type: 'divide-by-zero', code: 2 }, state };
  const reg = slotName(slot);
  return { ok: true, state: { ...state, [reg]: state[reg] / value } };
};
