import { type CfState, emptySlot } from './reducer';
export const deleteCashflow = (state: CfState, index: number): CfState => {
  if (index <= 0 || index > 24 || state.slots[index - 1].value === null && state.slots.slice(index).every((s) => s.value === null)) return state;
  const slots = state.slots.slice();
  slots.splice(index - 1, 1);
  slots.push(emptySlot());
  return { ...state, slots };
};
