import { type CfState } from './reducer';
export const prunedCashflows = (state: CfState) => {
  let last = -1;
  state.slots.forEach((slot, index) => { if (slot.value !== null) last = index; });
  return [{ value: state.cf0, frequency: 1 }, ...state.slots.slice(0, last + 1).map((s) => ({ value: s.value ?? 0, frequency: s.frequency }))];
};
