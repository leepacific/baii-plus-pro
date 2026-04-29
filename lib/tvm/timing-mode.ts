export type TimingMode = 'END' | 'BGN';
export interface TimingState { timing: TimingMode }
export const initialTimingMode = (): TimingState => ({ timing: 'END' });
export const toggleTimingMode = (state: TimingState): TimingState => ({ timing: state.timing === 'END' ? 'BGN' : 'END' });
export const paymentShiftFactor = (periodicRate: number, timing: TimingMode): number => timing === 'BGN' ? 1 + periodicRate : 1;
