// PAGE-001 (`/`). CF worksheet entry + CFo slot — TASK-174.
import type { Worksheet, WorksheetAction, WorksheetView } from '../controller';
import { createEntryBuffer } from '../entry-buffer';
import { advanceCfFocus, type CfSlot } from './cf-nav';
import { commitCfEntry } from './cf-entry';

export interface CfState {
  cf0: number;
  values: (number | null)[]; // C01..C24
  freqs: number[];           // F01..F24 (default 1)
  focus: CfSlot;
  error: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
}

export const initialCf = (): CfState => ({
  cf0: 0,
  values: Array.from({ length: 24 }, () => null),
  freqs: Array.from({ length: 24 }, () => 1),
  focus: 'CFo',
  error: null,
});

export const createCfWorksheet = (): Worksheet & { state: CfState } => {
  const state: CfState = initialCf();
  const entry = createEntryBuffer();

  const view = (): WorksheetView => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.focus };
    const num = entry.read();
    if (num !== null) return { primary: { kind: 'number', value: num }, label: state.focus };
    if (state.focus === 'CFo') return { primary: { kind: 'number', value: state.cf0 }, label: 'CFo' };
    if (state.focus.startsWith('C')) {
      const idx = parseInt(state.focus.slice(1), 10) - 1;
      const v = state.values[idx];
      return { primary: v === null ? { kind: 'number', value: 0 } : { kind: 'number', value: v }, label: state.focus };
    }
    if (state.focus.startsWith('F')) {
      const idx = parseInt(state.focus.slice(1), 10) - 1;
      return { primary: { kind: 'number', value: state.freqs[idx] }, label: state.focus };
    }
    return { primary: { kind: 'number', value: 0 }, label: state.focus };
  };

  return {
    id: 'CF',
    state,
    view,
    press(action: WorksheetAction): boolean {
      if (state.error && action.kind !== 'clear') state.error = null;
      if (action.kind === 'arrow') {
        const next = advanceCfFocus(state.focus, action.dir);
        if (next) state.focus = next;
        entry.reset();
        return true;
      }
      if (action.kind === 'enter') {
        const result = commitCfEntry(state, entry.read());
        if (result.error) state.error = result.error;
        else { state.cf0 = result.cf0; state.values = result.values; state.freqs = result.freqs; }
        entry.reset();
        return true;
      }
      if (action.kind === 'digit' || action.kind === 'decimal' || action.kind === 'sign') {
        entry.push(action);
        return true;
      }
      if (action.kind === 'clear') {
        entry.reset();
        return true;
      }
      return true;
    },
  };
};
