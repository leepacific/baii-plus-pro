import { initialMemoryState, type MemoryState } from '../../lib/memory/state';
import { initialFormatState, type FormatState } from '../../lib/display/state';
import { type ErrorCode } from './errors';

export type WorksheetMode = 'standard' | 'tvm' | 'amort' | 'cf' | 'bond' | 'depr' | 'date' | 'iconv' | 'profit' | 'bep' | 'stat' | 'mem';
export type TimingMode = 'END' | 'BGN';
export type ArithOperator = '+' | '-' | '*' | '/' | '^';
export interface DisplayState { value: number; entry: string; pendingOperator: ArithOperator | null; accumulator: number|null; justEvaluated: boolean; parenStack?: { accumulator: number | null; pendingOperator: ArithOperator | null }[] }
export interface TvmRegisters { N: number|null; IY: number|null; PV: number|null; PMT: number|null; FV: number|null; PY: number; CY: number; cyIndependent: boolean; timing: TimingMode; lastTvmKey: 'N'|'IY'|'PV'|'PMT'|'FV'|null; cptPending: boolean }
export interface EngineState { mode: WorksheetMode; display: DisplayState; tvm: TvmRegisters; memory: MemoryState; format: FormatState; secondLatched: boolean; error: ErrorCode | null }
export const DefaultState: EngineState = {
  mode: 'standard',
  display: { value: 0, entry: '0', pendingOperator: null, accumulator: null, justEvaluated: false },
  tvm: { N: null, IY: null, PV: null, PMT: null, FV: null, PY: 1, CY: 1, cyIndependent: false, timing: 'END', lastTvmKey: null, cptPending: false },
  memory: initialMemoryState(),
  format: initialFormatState(),
  secondLatched: false,
  error: null
};
export const cloneDefaultState = (): EngineState => structuredClone(DefaultState);
