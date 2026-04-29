import { type MemoryState, slotName } from './state';
export const sto = (state: MemoryState, slot: number, value: number): MemoryState => {
  const reg = slotName(slot);
  return { ...state, [reg]: value };
};
