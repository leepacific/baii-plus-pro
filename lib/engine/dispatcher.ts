import { KeyId } from '../../src/keypad/key-id';
import { type EngineState } from '../../src/core/state';
import { reduceStandard } from '../../src/core/reducers/standard';
import { commitTvmRegister, computeTvmFor } from '../../src/core/reducers/tvm';
import { reduceSecondModifier } from '../../src/core/reducers/secondModifier';
import { reduceScientific, sqrtOp } from '../../src/core/reducers/scientific';
import { SecondaryFunction } from '../../src/keypad/secondary-function-map';
export type ReducerId = 'second'|'standard'|'tvm'|'sci'|'noop';
export interface DispatchResult { state: EngineState; reducerId: ReducerId }
const SCIENTIFIC_SECONDARY: SecondaryFunction[] = [
  SecondaryFunction.SQUARE,
  SecondaryFunction.RECIPROCAL,
  SecondaryFunction.LN,
  SecondaryFunction.EXP,
  SecondaryFunction.LOG,
  SecondaryFunction.TEN_X,
  SecondaryFunction.FACTORIAL,
];
const TVM_REGISTER_KEYS: KeyId[] = [KeyId.N, KeyId.I_Y, KeyId.PV, KeyId.PMT, KeyId.FV];
const clearCptPending = (state: EngineState): EngineState =>
  state.tvm.cptPending ? { ...state, tvm: { ...state.tvm, cptPending: false } } : state;
export const dispatchKey = (state: EngineState, key: KeyId): DispatchResult => {
  // ON/OFF toggles powered state. The powered=false short-circuit is
  // applied at the Engine wrapper layer (createEngine), not here, so unit
  // tests that exercise reducers directly do not need to power-on first.
  if (key === KeyId.ON_OFF) {
    return { state: { ...state, powered: !state.powered }, reducerId: 'noop' };
  }
  const second = reduceSecondModifier(state, key);
  if (second.consumed) return { state: second.state, reducerId: 'second' };
  if (second.secondary) {
    // BGN/END toggle (2ND+ARROW_UP per the canonical 2nd-function map).
    if (second.secondary === SecondaryFunction.BGN) {
      const timing = second.state.tvm.timing === 'BGN' ? 'END' : 'BGN';
      return { state: { ...second.state, tvm: { ...second.state.tvm, timing } }, reducerId: 'second' };
    }
    if (SCIENTIFIC_SECONDARY.includes(second.secondary)) {
      // 2ND-prefixed scientific path consumes any pending CPT (non-TVM action).
      return { state: reduceScientific(clearCptPending(second.state), second.secondary), reducerId: 'sci' };
    }
    // Other secondaries (CF, NPV, AMORT, BOND, ...) are surfaced via the
    // worksheet controller in the UI layer; engine-side they pass through.
    return { state: second.state, reducerId: 'second' };
  }
  // CPT is a MODIFIER on the BA II Plus Pro: pressing CPT does not compute
  // immediately; it sets a `cptPending` flag. The NEXT TVM-register key
  // (N|I/Y|PV|PMT|FV) triggers the solve for THAT register (REQ-009 fix).
  if (key === KeyId.CPT) {
    return { state: { ...state, tvm: { ...state.tvm, cptPending: true } }, reducerId: 'tvm' };
  }
  if (TVM_REGISTER_KEYS.includes(key)) {
    if (state.tvm.cptPending) {
      // CPT-then-register: solve for THIS register, write into both display
      // and the corresponding tvm field, clear cptPending.
      return { state: computeTvmFor(state, key), reducerId: 'tvm' };
    }
    return { state: commitTvmRegister(state, key), reducerId: 'tvm' };
  }
  // Any non-TVM-register, non-CPT keypress clears a stale cptPending so it
  // does not bleed into a later register entry. Mirrors device behavior.
  const cleared = clearCptPending(state);
  // Primary SQRT key (no 2ND): unary √x — handled in reduceStandard, but route
  // here in case state needs the dedicated sqrtOp wrapper. Either reaches the
  // same result; delegate to reduceStandard for consistency.
  void sqrtOp;
  const next = reduceStandard(cleared, key);
  return { state: next, reducerId: next === cleared ? (cleared === state ? 'noop' : 'standard') : 'standard' };
};
// Bridge for chassis "virtual" key ids (V_YX, V_RECIP, V_LN, ...) that are
// not part of the engine KeyId enum but still need to drive the scientific
// reducer (REQ-007 fix). Maps each virtual id to a unary scientific op on
// the current display.value.
//   V_YX    → POWER (binary y^x — the chassis pairs this with a second
//             operand entered before EQUALS; we route to reduceStandard
//             with KeyId.POWER so the operator is registered as a binary
//             pending-op exactly like the primary POWER key).
//   V_RECIP → RECIPROCAL (1/x, unary)
//   V_LN    → LN (natural log, unary)
export const dispatchVirtualKey = (state: EngineState, virtualId: string): DispatchResult => {
  const cleared = clearCptPending(state);
  switch (virtualId) {
    case 'V_YX':
      // Binary y^x: register POWER as a pending operator via the standard
      // reducer. The user enters base, presses yˣ, enters exponent, presses =.
      return { state: reduceStandard(cleared, KeyId.POWER), reducerId: 'standard' };
    case 'V_RECIP':
      return { state: reduceScientific(cleared, SecondaryFunction.RECIPROCAL), reducerId: 'sci' };
    case 'V_LN':
      return { state: reduceScientific(cleared, SecondaryFunction.LN), reducerId: 'sci' };
    default:
      return { state, reducerId: 'noop' };
  }
};
