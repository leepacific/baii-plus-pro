// PAGE-001 (`/`). BREAKEVEN worksheet mode — REQ-019.
// Slots: FC (fixed cost), VC (variable cost), P (price), PFT (profit), Q (qty).
import type { Worksheet, WorksheetAction, WorksheetView } from '../controller';
import { createEntryBuffer } from '../entry-buffer';
import { solveFc } from '../../../../lib/bep/solve-fc';
import { solveVc } from '../../../../lib/bep/solve-vc';
import { solveP } from '../../../../lib/bep/solve-p';
import { solvePft } from '../../../../lib/bep/solve-pft';
import { solveQ } from '../../../../lib/bep/solve-q';

export type BepSlot = 'FC' | 'VC' | 'P' | 'PFT' | 'Q';

const ORDER: BepSlot[] = ['FC', 'VC', 'P', 'PFT', 'Q'];

const advance = (current: BepSlot, dir: 'up' | 'down'): BepSlot | null => {
  const i = ORDER.indexOf(current);
  if (i < 0) return null;
  const next = dir === 'down' ? i + 1 : i - 1;
  if (next < 0 || next >= ORDER.length) return null;
  return ORDER[next];
};

export interface BepViewState {
  FC: number | null;
  VC: number | null;
  P: number | null;
  PFT: number | null;
  Q: number | null;
  focus: BepSlot;
  error: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
}

export const createBreakevenWorksheet = (): Worksheet & { state: BepViewState } => {
  const state: BepViewState = { FC: null, VC: null, P: null, PFT: null, Q: null, focus: 'FC', error: null };
  const entry = createEntryBuffer();

  const view = (): WorksheetView => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.focus };
    const num = entry.read();
    if (num !== null) return { primary: { kind: 'number', value: num }, label: state.focus };
    const v = state[state.focus];
    return { primary: { kind: 'number', value: v ?? 0 }, label: state.focus };
  };

  return {
    id: 'BREAKEVEN',
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
        if (v !== null) state[state.focus] = v;
        entry.reset();
        return true;
      }
      if (action.kind === 'cpt') {
        const { FC, VC, P, PFT, Q } = state;
        if (state.focus === 'FC' && VC !== null && P !== null && PFT !== null && Q !== null) {
          state.FC = solveFc(VC, P, PFT, Q);
        } else if (state.focus === 'VC' && FC !== null && P !== null && PFT !== null && Q !== null) {
          state.VC = solveVc(FC, P, PFT, Q);
        } else if (state.focus === 'P' && FC !== null && VC !== null && PFT !== null && Q !== null) {
          state.P = solveP(FC, VC, PFT, Q);
        } else if (state.focus === 'PFT' && FC !== null && VC !== null && P !== null && Q !== null) {
          state.PFT = solvePft(FC, VC, P, Q);
        } else if (state.focus === 'Q' && FC !== null && VC !== null && P !== null && PFT !== null) {
          const r = solveQ(FC, VC, P, PFT);
          if (typeof r === 'number') state.Q = r;
          else state.error = 2;
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
