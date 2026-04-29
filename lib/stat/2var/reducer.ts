export type RegressionMode = 'LIN'|'Ln'|'EXP'|'PWR';
export interface Stat2Slot { x: number | null; y: number | null }
export interface Stat2State { mode: RegressionMode; slots: Stat2Slot[]; cursor: number }
export const initialStat2State = (): Stat2State => ({ mode: 'LIN', slots: Array.from({ length: 50 }, () => ({ x: null, y: null })), cursor: 0 });
export const editStat2Slot = (state: Stat2State, x: number, y: number): Stat2State => ({ ...state, slots: state.slots.map((s, i) => i === state.cursor ? { x, y } : s) });
export const cycleRegressionMode = (state: Stat2State): Stat2State => ({ ...state, mode: ({ LIN: 'Ln', Ln: 'EXP', EXP: 'PWR', PWR: 'LIN' } as const)[state.mode] });
