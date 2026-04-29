export interface Stat1Slot { x: number | null; y: number }
export interface Stat1State { mode: '1-V'; slots: Stat1Slot[]; cursor: number }
export const initialStat1State = (): Stat1State => ({ mode: '1-V', slots: Array.from({ length: 50 }, () => ({ x: null, y: 1 })), cursor: 0 });
export const editStat1Slot = (state: Stat1State, x: number, y = 1): Stat1State => ({ ...state, slots: state.slots.map((s, i) => i === state.cursor ? { x, y } : s) });
