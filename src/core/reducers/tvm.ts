import { KeyId } from '../../keypad/key-id';
import { type EngineState } from '../state';
import { solveFV } from '../../../lib/tvm/solve-fv';
import { solvePV } from '../../../lib/tvm/solve-pv';
import { solvePMT } from '../../../lib/tvm/solve-pmt';
import { solveN } from '../../../lib/tvm/solve-n';
import { solveIY } from '../../../lib/tvm/solve-iy';
export const commitTvmRegister = (state: EngineState, key: KeyId): EngineState => {
  const value = state.display.value;
  const map = { [KeyId.N]: 'N', [KeyId.I_Y]: 'IY', [KeyId.PV]: 'PV', [KeyId.PMT]: 'PMT', [KeyId.FV]: 'FV' } as const;
  const reg = map[key as keyof typeof map];
  if (!reg) return state;
  // After committing, reset the entry buffer so the next register's digits start
  // a fresh number (the device behaves this way; without this, digits from N
  // concatenate into I/Y, etc. — REQ-009 fix).
  return {
    ...state,
    mode: 'tvm',
    tvm: { ...state.tvm, [reg]: value, lastTvmKey: reg },
    display: { ...state.display, value, entry: '0', pendingOperator: null, accumulator: null, justEvaluated: true },
  };
};
export const computeTvm = (state: EngineState): EngineState => {
  const t = state.tvm;
  const target = t.lastTvmKey;
  const common = { PY: t.PY, CY: t.CY, timing: t.timing };
  let value = state.display.value;
  if (target === 'FV' && t.N !== null && t.IY !== null && t.PV !== null && t.PMT !== null) value = solveFV({ ...common, N: t.N, IY: t.IY, PV: t.PV, PMT: t.PMT });
  if (target === 'PV' && t.N !== null && t.IY !== null && t.PMT !== null && t.FV !== null) value = solvePV({ ...common, N: t.N, IY: t.IY, PMT: t.PMT, FV: t.FV });
  if (target === 'PMT' && t.N !== null && t.IY !== null && t.PV !== null && t.FV !== null) value = solvePMT({ ...common, N: t.N, IY: t.IY, PV: t.PV, FV: t.FV });
  if (target === 'N' && t.IY !== null && t.PV !== null && t.PMT !== null && t.FV !== null) value = solveN({ ...common, IY: t.IY, PV: t.PV, PMT: t.PMT, FV: t.FV });
  if (target === 'IY' && t.N !== null && t.PV !== null && t.PMT !== null && t.FV !== null) value = solveIY({ ...common, N: t.N, PV: t.PV, PMT: t.PMT, FV: t.FV });
  return { ...state, display: { ...state.display, value, entry: String(value), justEvaluated: true } };
};

// Solve TVM for the register that the user just pressed AFTER a CPT modifier.
// CPT is a "compute next register" modifier on the BA II Plus Pro: pressing
// `... CPT PMT` (or any of N|I_Y|PV|FV) means "solve for that register using
// the four others". Returns a state with both `display.value` and the
// corresponding `state.tvm[reg]` updated to the solved value, plus
// `tvm.cptPending` cleared and `tvm.lastTvmKey` set to the solved register.
// (REQ-009 fix.)
export const computeTvmFor = (state: EngineState, key: KeyId): EngineState => {
  const map = { [KeyId.N]: 'N', [KeyId.I_Y]: 'IY', [KeyId.PV]: 'PV', [KeyId.PMT]: 'PMT', [KeyId.FV]: 'FV' } as const;
  const reg = map[key as keyof typeof map];
  if (!reg) return { ...state, tvm: { ...state.tvm, cptPending: false } };
  const t = state.tvm;
  const common = { PY: t.PY, CY: t.CY, timing: t.timing };
  let value = state.display.value;
  if (reg === 'FV' && t.N !== null && t.IY !== null && t.PV !== null && t.PMT !== null) value = solveFV({ ...common, N: t.N, IY: t.IY, PV: t.PV, PMT: t.PMT });
  else if (reg === 'PV' && t.N !== null && t.IY !== null && t.PMT !== null && t.FV !== null) value = solvePV({ ...common, N: t.N, IY: t.IY, PMT: t.PMT, FV: t.FV });
  else if (reg === 'PMT' && t.N !== null && t.IY !== null && t.PV !== null && t.FV !== null) value = solvePMT({ ...common, N: t.N, IY: t.IY, PV: t.PV, FV: t.FV });
  else if (reg === 'N' && t.IY !== null && t.PV !== null && t.PMT !== null && t.FV !== null) value = solveN({ ...common, IY: t.IY, PV: t.PV, PMT: t.PMT, FV: t.FV });
  else if (reg === 'IY' && t.N !== null && t.PV !== null && t.PMT !== null && t.FV !== null) value = solveIY({ ...common, N: t.N, PV: t.PV, PMT: t.PMT, FV: t.FV });
  return {
    ...state,
    mode: 'tvm',
    tvm: { ...t, [reg]: value, lastTvmKey: reg, cptPending: false },
    display: { ...state.display, value, entry: String(value), pendingOperator: null, accumulator: null, justEvaluated: true },
  };
};
