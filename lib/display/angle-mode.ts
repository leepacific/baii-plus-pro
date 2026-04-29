import { type AngleMode, type FormatState } from './state';
export const ANGLE_MODE_CONSUMERS = [] as const;
export const setAngleMode = (state: FormatState, mode: AngleMode): FormatState => ({ ...state, angleMode: mode });
export const getAngleMode = (state: FormatState): AngleMode => state.angleMode;
