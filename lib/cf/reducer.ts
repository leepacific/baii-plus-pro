export interface CashflowSlot { value: number | null; frequency: number }
export interface CfState { cf0: number; slots: CashflowSlot[]; cursor: string }
export const emptySlot = (): CashflowSlot => ({ value: null, frequency: 1 });
export const initialCfState = (): CfState => ({ cf0: 0, slots: Array.from({ length: 24 }, emptySlot), cursor: 'CF0' });
export const commitCashflowValue = (state: CfState, index: number, value: number): CfState => index === 0 ? { ...state, cf0: value } : { ...state, slots: state.slots.map((s, i) => i === index - 1 ? { ...s, value } : s) };
export const commitFrequency = (state: CfState, index: number, frequency: number): CfState => ({ ...state, slots: state.slots.map((s, i) => i === index - 1 ? { ...s, frequency } : s) });
