import { cloneDefaultState, type EngineState } from '../core/state';
import { KeyId } from '../keypad/key-id';
import { renderDisplayState } from '../display/render';
import { dispatchKey, dispatchVirtualKey } from '../../lib/engine/dispatcher';
export interface Engine {
  pressKey: (keyId: KeyId) => void;
  pressVirtual: (virtualId: string) => void;
  getDisplay: () => string;
  getState: () => Readonly<EngineState>;
  setDisplayValue: (n: number) => void;
}
export const createEngine = (): Engine => {
  let state = cloneDefaultState();
  return {
    pressKey(keyId: KeyId) { state = dispatchKey(state, keyId).state; },
    // Route chassis virtual ids (V_YX / V_RECIP / V_LN) into the scientific /
    // standard reducers (REQ-007 fix).
    pressVirtual(virtualId: string) { state = dispatchVirtualKey(state, virtualId).state; },
    getDisplay() { return renderDisplayState(state).primaryGlyphs; },
    getState() { return structuredClone(state); },
    // Force-set the display value (used by RCL to surface a recalled register
    // onto the LCD without going through digit-by-digit entry). Resets entry
    // bookkeeping so subsequent input behaves like just-evaluated.
    setDisplayValue(n: number) {
      state = {
        ...state,
        display: { value: n, entry: String(n), pendingOperator: null, accumulator: null, justEvaluated: true },
      };
    },
  };
};
