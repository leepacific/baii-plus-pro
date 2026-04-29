import { KeyId } from '../../keypad/key-id';
import { resolveSecondaryFunction, type SecondaryFunction } from '../../keypad/secondary-function-map';
import { type EngineState } from '../state';
export interface SecondResolution { state: EngineState; secondary: SecondaryFunction | null; consumed: boolean }
export const reduceSecondModifier = (state: EngineState, key: KeyId): SecondResolution => {
  if (key === KeyId.SECOND) return { state: { ...state, secondLatched: !state.secondLatched }, secondary: null, consumed: true };
  if (!state.secondLatched) return { state, secondary: null, consumed: false };
  return { state: { ...state, secondLatched: false }, secondary: resolveSecondaryFunction(key), consumed: false };
};
