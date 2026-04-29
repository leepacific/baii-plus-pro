// PAGE-001 (`/`). ICONV worksheet mode — TASK-181.
import type { Worksheet, WorksheetAction, WorksheetView } from '../controller';
import { createEntryBuffer } from '../entry-buffer';
import { advanceIconvFocus, type IconvSlot } from './iconv-nav';
import { computeIconv } from './iconv-compute';

export interface IconvViewState {
  NOM: number | null;
  EFF: number | null;
  CY: number;
  focus: IconvSlot;
  error: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
}

export const createIconvWorksheet = (): Worksheet & { state: IconvViewState } => {
  const state: IconvViewState = { NOM: null, EFF: null, CY: 1, focus: 'NOM', error: null };
  const entry = createEntryBuffer();

  const view = (): WorksheetView => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.focus };
    const num = entry.read();
    if (num !== null) return { primary: { kind: 'number', value: num }, label: state.focus };
    const v = state.focus === 'NOM' ? state.NOM : state.focus === 'EFF' ? state.EFF : state.CY;
    return { primary: { kind: 'number', value: v ?? 0 }, label: state.focus };
  };

  return {
    id: 'ICONV',
    state,
    view,
    press(action: WorksheetAction): boolean {
      if (state.error && action.kind !== 'clear') state.error = null;
      if (action.kind === 'arrow') {
        const next = advanceIconvFocus(state.focus, action.dir);
        if (next) state.focus = next;
        entry.reset();
        return true;
      }
      if (action.kind === 'enter') {
        const v = entry.read();
        if (v !== null) {
          if (state.focus === 'NOM') state.NOM = v;
          else if (state.focus === 'EFF') state.EFF = v;
          else state.CY = Math.max(1, Math.floor(v));
        }
        entry.reset();
        return true;
      }
      if (action.kind === 'cpt') {
        const out = computeIconv(state);
        if (out.error) state.error = out.error;
        else { state.NOM = out.NOM; state.EFF = out.EFF; }
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
