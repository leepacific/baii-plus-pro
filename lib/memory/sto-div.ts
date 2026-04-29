import { type MemoryState } from './state';
import { stoDivOrError } from './sto-div-error';
export const stoDiv = (state: MemoryState, slot: number, value: number): MemoryState => {
  const result = stoDivOrError(state, slot, value);
  if (!result.ok) return state;
  return result.state;
};
