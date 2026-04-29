import { effectiveRate } from './cy-field';
export interface PyState { PY: number }
export const initialPyState = (): PyState => ({ PY: 1 });
export const setPY = (state: PyState, PY: number): PyState => ({ ...state, PY });
export const periodicRate = (iyPercent: number, py: number, cy: number): number => effectiveRate(iyPercent, py, cy);
