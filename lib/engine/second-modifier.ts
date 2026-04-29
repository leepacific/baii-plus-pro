import { KeyId } from '../../src/keypad/key-id';
export interface ModifierState { secondLatched: boolean }
export type SecondTransition = { type: 'idle' } | { type: 'latch' } | { type: 'cancel' } | { type: 'fire-and-clear' };
export const reduceSecondState = (state: ModifierState, key: KeyId, hasSecondary = true): { state: ModifierState; transition: SecondTransition } => {
  if (key === KeyId.SECOND) return state.secondLatched ? { state: { secondLatched: false }, transition: { type: 'cancel' } } : { state: { secondLatched: true }, transition: { type: 'latch' } };
  if (state.secondLatched && hasSecondary) return { state: { secondLatched: false }, transition: { type: 'fire-and-clear' } };
  return { state, transition: { type: 'idle' } };
};
