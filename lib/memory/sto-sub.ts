import { type MemoryState, slotName } from './state';
export const stoSub = (state: MemoryState, slot: number, value: number): MemoryState => {
  const reg = slotName(slot);
  return { ...state, [reg]: state[slotName(slot)] - value };
};
