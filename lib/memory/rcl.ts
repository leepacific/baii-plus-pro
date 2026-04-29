import { type MemoryState, slotName } from './state';
export const rcl = (state: MemoryState, slot: number): number => state[slotName(slot)];
