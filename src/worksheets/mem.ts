// PAGE-001 (`/`). MEM worksheet — TASK-204.
// 2ND+MEM enters worksheet mode; arrow keys cycle M0..M9 (wrap).
import type { Worksheet, WorksheetAction, WorksheetView } from '../ui/worksheets/controller';
import type { MemoryState } from '../../lib/memory/state';
import { MEMORY_REGISTERS } from '../../lib/memory/state';

export interface MemViewState {
  cursor: number;
  registers: MemoryState;
}

export const createMemWorksheet = (
  getRegisters: () => MemoryState,
  setRegisters: (r: MemoryState) => void,
): Worksheet => {
  const state: MemViewState = { cursor: 0, registers: getRegisters() };

  const view = (): WorksheetView => {
    state.registers = getRegisters();
    const slot = MEMORY_REGISTERS[state.cursor];
    return {
      primary: { kind: 'number', value: state.registers[slot] ?? 0 },
      label: slot,
    };
  };

  return {
    id: 'MEM',
    view,
    press(action: WorksheetAction): boolean {
      if (action.kind === 'arrow') {
        const len = MEMORY_REGISTERS.length;
        state.cursor = action.dir === 'down' ? (state.cursor + 1) % len : (state.cursor - 1 + len) % len;
        return true;
      }
      if (action.kind === 'enter') {
        // No-op; MEM is browse-only via this worksheet entry point
        return true;
      }
      if (action.kind === 'clear') {
        const slot = MEMORY_REGISTERS[state.cursor];
        const next = { ...state.registers, [slot]: 0 };
        setRegisters(next);
        state.registers = next;
        return true;
      }
      return true;
    },
  };
};
