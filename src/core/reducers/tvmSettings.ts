import { type EngineState } from '../state';
export const toggleBgnEnd = (state: EngineState): EngineState => ({ ...state, tvm: { ...state.tvm, timing: state.tvm.timing === 'END' ? 'BGN' : 'END' } });
export const setPY = (state: EngineState, PY: number): EngineState => ({ ...state, tvm: { ...state.tvm, PY, CY: state.tvm.cyIndependent ? state.tvm.CY : PY } });
export const setCY = (state: EngineState, CY: number): EngineState => ({ ...state, tvm: { ...state.tvm, CY, cyIndependent: true } });
