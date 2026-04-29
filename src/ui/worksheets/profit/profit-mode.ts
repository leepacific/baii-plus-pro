// PAGE-001 (`/`). PROFIT worksheet mode — REQ-018.
// Slots: CST, SEL, MAR. CPT solves whichever slot is blank/last-empty.
import type { Worksheet, WorksheetAction, WorksheetView } from '../controller';
import { createEntryBuffer } from '../entry-buffer';
import { solveCst } from '../../../../lib/profit/solve-cst';
import { solveSel } from '../../../../lib/profit/solve-sel';
import { solveMar } from '../../../../lib/profit/solve-mar';

export type ProfitSlot = 'CST' | 'SEL' | 'MAR';

const ORDER: ProfitSlot[] = ['CST', 'SEL', 'MAR'];

const advance = (current: ProfitSlot, dir: 'up' | 'down'): ProfitSlot | null => {
  const i = ORDER.indexOf(current);
  if (i < 0) return null;
  const next = dir === 'down' ? i + 1 : i - 1;
  if (next < 0 || next >= ORDER.length) return null;
  return ORDER[next];
};

export interface ProfitViewState {
  CST: number | null;
  SEL: number | null;
  MAR: number | null;
  focus: ProfitSlot;
  error: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
}

export const createProfitWorksheet = (): Worksheet & { state: ProfitViewState } => {
  const state: ProfitViewState = { CST: null, SEL: null, MAR: null, focus: 'CST', error: null };
  const entry = createEntryBuffer();

  const view = (): WorksheetView => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.focus };
    const num = entry.read();
    if (num !== null) return { primary: { kind: 'number', value: num }, label: state.focus };
    const v = state.focus === 'CST' ? state.CST : state.focus === 'SEL' ? state.SEL : state.MAR;
    return { primary: { kind: 'number', value: v ?? 0 }, label: state.focus };
  };

  return {
    id: 'PROFIT',
    state,
    view,
    press(action: WorksheetAction): boolean {
      if (state.error && action.kind !== 'clear') state.error = null;
      if (action.kind === 'arrow') {
        const next = advance(state.focus, action.dir);
        if (next) state.focus = next;
        entry.reset();
        return true;
      }
      if (action.kind === 'enter') {
        const v = entry.read();
        if (v !== null) {
          if (state.focus === 'CST') state.CST = v;
          else if (state.focus === 'SEL') state.SEL = v;
          else state.MAR = v;
        }
        entry.reset();
        return true;
      }
      if (action.kind === 'cpt') {
        if (state.focus === 'CST' && state.SEL !== null && state.MAR !== null) {
          state.CST = solveCst(state.SEL, state.MAR);
        } else if (state.focus === 'SEL' && state.CST !== null && state.MAR !== null) {
          const r = solveSel(state.CST, state.MAR);
          if (typeof r === 'number') state.SEL = r;
          else state.error = 2;
        } else if (state.focus === 'MAR' && state.CST !== null && state.SEL !== null) {
          state.MAR = solveMar(state.CST, state.SEL);
        } else {
          state.error = 4;
        }
        return true;
      }
      if (action.kind === 'digit' || action.kind === 'decimal' || action.kind === 'sign') {
        entry.push(action);
        return true;
      }
      if (action.kind === 'clear') { entry.reset(); return true; }
      return true;
    },
  };
};
