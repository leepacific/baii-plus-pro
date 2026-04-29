import { type CfState, emptySlot } from './reducer';
export const insertCashflow = (state: CfState, index: number): CfState => {
  if (index <= 0 || index > 24) return state;
  const slots = state.slots.slice();
  slots.splice(index - 1, 0, emptySlot());
  return { ...state, slots: slots.slice(0, 24) };
};
