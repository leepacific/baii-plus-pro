// PAGE-001 (`/`). AMORT mode entry — TASK-169.
// 2ND+AMORT enters worksheet mode showing the active slot label; 2ND+QUIT exits.
import type { Engine } from '../../../engine/index';
import type { Worksheet, WorksheetAction, WorksheetView } from '../controller';
import { createEntryBuffer } from '../entry-buffer';
import { advanceAmortFocus } from './amort-nav';
import { commitAmortEntry } from './amort-entry';
import { computeAmortSlot } from './amort-compute';

export type AmortSlot = 'P1' | 'P2' | 'BAL' | 'PRN' | 'INT';

export interface AmortViewState {
  P1: number;
  P2: number;
  focus: AmortSlot;
  computed: { BAL: number | null; PRN: number | null; INT: number | null };
  error: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
}

export const createAmortWorksheet = (engine: Engine): Worksheet => {
  const state: AmortViewState = {
    P1: 1, P2: 1, focus: 'P1',
    computed: { BAL: null, PRN: null, INT: null },
    error: null,
  };
  const entry = createEntryBuffer();

  const view = (): WorksheetView => {
    if (state.error) {
      return { primary: { kind: 'error', code: state.error }, label: state.focus };
    }
    if (state.focus === 'P1' || state.focus === 'P2') {
      const num = entry.read();
      if (num !== null) {
        return { primary: { kind: 'number', value: num }, label: state.focus };
      }
      return { primary: { kind: 'number', value: state[state.focus] }, label: state.focus };
    }
    const v = state.computed[state.focus];
    return {
      primary: v === null ? { kind: 'text', text: '0.00' } : { kind: 'number', value: v },
      label: state.focus,
    };
  };

  return {
    id: 'AMORT',
    view,
    press(action: WorksheetAction): boolean {
      // Clear error on next interaction
      if (state.error && action.kind !== 'clear') state.error = null;

      if (action.kind === 'arrow') {
        state.focus = advanceAmortFocus(state.focus, action.dir);
        entry.reset();
        return true;
      }
      if (action.kind === 'enter') {
        const result = commitAmortEntry(state, entry.read());
        if (result.error) state.error = result.error;
        else { state.P1 = result.P1; state.P2 = result.P2; }
        entry.reset();
        return true;
      }
      if (action.kind === 'cpt') {
        if (state.focus === 'BAL' || state.focus === 'PRN' || state.focus === 'INT') {
          const out = computeAmortSlot(engine, state);
          state.computed = out.computed;
          if (out.error) state.error = out.error;
        }
        return true;
      }
      if (action.kind === 'digit' || action.kind === 'decimal' || action.kind === 'sign') {
        if (state.focus === 'P1' || state.focus === 'P2') {
          entry.push(action);
        }
        return true;
      }
      if (action.kind === 'clear') {
        if (state.error) { state.error = null; return true; }
        entry.reset();
        return true;
      }
      return true;
    },
  };
};
