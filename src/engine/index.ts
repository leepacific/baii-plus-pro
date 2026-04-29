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
export interface CreateEngineOptions {
  // Default true to keep tests + library callers working without explicit
  // ON/OFF presses. The web app (main.ts) passes false so the chassis
  // boots powered off — matches physical BA II Plus behavior where the
  // device defaults off until the user presses ON.
  initiallyPowered?: boolean;
}
export const createEngine = (opts: CreateEngineOptions = {}): Engine => {
  let state = cloneDefaultState();
  if (opts.initiallyPowered !== false) state = { ...state, powered: true };
  return {
    pressKey(keyId: KeyId) {
      // Powered-off short-circuit: only ON/OFF is honored when off. This
      // matches physical BA II Plus behavior and keeps reducers / dispatcher
      // tests free of the powered-state gate.
      if (!state.powered && keyId !== KeyId.ON_OFF) return;
      state = dispatchKey(state, keyId).state;
    },
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
