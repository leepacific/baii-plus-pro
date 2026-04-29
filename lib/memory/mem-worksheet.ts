import { initialMemoryState, MEMORY_REGISTERS, type MemoryState } from './state';
export type MemWorksheetState = { registers: MemoryState; cursor: number };
export type MemAction = { type: 'NEXT' } | { type: 'PREV' } | { type: 'EDIT'; value: number };
export const initialMemWorksheet = (): MemWorksheetState => ({ registers: initialMemoryState(), cursor: 0 });
export const memWorksheetReducer = (state: MemWorksheetState, action: MemAction): MemWorksheetState => {
  if (action.type === 'NEXT') return { ...state, cursor: (state.cursor + 1) % 10 };
  if (action.type === 'PREV') return { ...state, cursor: (state.cursor + 9) % 10 };
  return { ...state, registers: { ...state.registers, [MEMORY_REGISTERS[state.cursor]]: action.value } };
};
