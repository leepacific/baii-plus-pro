// PAGE-001 (`/`). CF Pro 2ND -> NPV/IRR/MIRR/NFV/PB/DPB sub-mode dispatch — TASK-178.
import type { Worksheet, WorksheetAction, WorksheetView } from '../controller';
import { createEntryBuffer } from '../entry-buffer';
import type { CfState } from './cf-mode';
import { npv, type CashflowTerm } from '../../../../lib/npv-irr/npv';
import { irr } from '../../../../lib/npv-irr/irr';

export type CfProSubMode = 'NPV' | 'IRR' | 'MIRR' | 'NFV' | 'PB' | 'DPB';

export interface CfProState {
  sub: CfProSubMode;
  slot: 'I' | 'RI' | 'RR' | 'RESULT';
  discountRate: number | null;
  financeRate: number | null;
  reinvestRate: number | null;
  result: number | null;
  error: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;
}

export const dispatchCfProSubMode = (cfState: CfState, sub: CfProSubMode): Worksheet => {
  const state: CfProState = {
    sub,
    slot: sub === 'IRR' ? 'RESULT' : sub === 'MIRR' ? 'RI' : 'I',
    discountRate: null,
    financeRate: null,
    reinvestRate: null,
    result: null,
    error: null,
  };
  const entry = createEntryBuffer();

  const buildTerms = (): CashflowTerm[] => {
    const terms: CashflowTerm[] = [{ value: cfState.cf0, frequency: 1 }];
    for (let i = 0; i < 24; i++) {
      const v = cfState.values[i];
      if (v == null) break;
      terms.push({ value: v, frequency: cfState.freqs[i] });
    }
    return terms;
  };

  const compute = (): void => {
    const terms = buildTerms();
    if (state.sub === 'IRR') {
      const r = irr(terms);
      if (r.ok) { state.result = r.value; state.slot = 'RESULT'; }
      else state.error = 7;
      return;
    }
    if (state.sub === 'NPV') {
      if (state.discountRate == null) { state.error = 4; return; }
      state.result = npv(state.discountRate, terms);
      state.slot = 'RESULT';
      return;
    }
    if (state.sub === 'NFV') {
      if (state.discountRate == null) { state.error = 4; return; }
      const n = terms.reduce((s, t, i) => s + (i === 0 ? 0 : t.frequency), 0);
      state.result = npv(state.discountRate, terms) * (1 + state.discountRate / 100) ** n;
      state.slot = 'RESULT';
      return;
    }
    if (state.sub === 'PB') {
      // Simple payback: cumulative cash flow turns non-negative
      let cum = cfState.cf0;
      let n = 0;
      for (let i = 0; i < cfState.values.length; i++) {
        const v = cfState.values[i];
        if (v == null) break;
        for (let f = 0; f < cfState.freqs[i]; f++) {
          n++;
          cum += v;
          if (cum >= 0) { state.result = n - (cum - v) / v; state.slot = 'RESULT'; return; }
        }
      }
      state.error = 5;
      return;
    }
    if (state.sub === 'DPB') {
      // Discounted payback
      if (state.discountRate == null) { state.error = 4; return; }
      const r = state.discountRate / 100;
      let cum = cfState.cf0;
      let n = 0;
      for (let i = 0; i < cfState.values.length; i++) {
        const v = cfState.values[i];
        if (v == null) break;
        for (let f = 0; f < cfState.freqs[i]; f++) {
          n++;
          const d = v / (1 + r) ** n;
          cum += d;
          if (cum >= 0) { state.result = n - (cum - d) / d; state.slot = 'RESULT'; return; }
        }
      }
      state.error = 5;
      return;
    }
    if (state.sub === 'MIRR') {
      if (state.financeRate == null || state.reinvestRate == null) { state.error = 4; return; }
      const fr = state.financeRate / 100;
      const rr = state.reinvestRate / 100;
      const flat = [cfState.cf0];
      for (let i = 0; i < cfState.values.length; i++) {
        const v = cfState.values[i];
        if (v == null) break;
        for (let f = 0; f < cfState.freqs[i]; f++) flat.push(v);
      }
      const n = flat.length - 1;
      let pvNeg = 0;
      let fvPos = 0;
      flat.forEach((c, t) => {
        if (c < 0) pvNeg += c / (1 + fr) ** t;
        else fvPos += c * (1 + rr) ** (n - t);
      });
      if (pvNeg === 0) { state.error = 5; return; }
      state.result = ((fvPos / -pvNeg) ** (1 / n) - 1) * 100;
      state.slot = 'RESULT';
      return;
    }
  };

  const view = (): WorksheetView => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.sub };
    const num = entry.read();
    if (state.slot === 'RESULT') {
      return {
        primary: state.result == null ? { kind: 'number', value: 0 } : { kind: 'number', value: state.result },
        label: state.sub,
      };
    }
    if (num !== null) return { primary: { kind: 'number', value: num }, label: state.slot };
    const v = state.slot === 'I' ? state.discountRate : state.slot === 'RI' ? state.financeRate : state.reinvestRate;
    return { primary: { kind: 'number', value: v ?? 0 }, label: state.slot };
  };

  return {
    id: `CF_${state.sub}`,
    view,
    press(action: WorksheetAction): boolean {
      if (state.error && action.kind !== 'clear') state.error = null;
      if (action.kind === 'arrow') {
        if (state.sub === 'MIRR') {
          const order: CfProState['slot'][] = ['I', 'RI', 'RR', 'RESULT'].filter(
            (s) => s !== 'I'
          ) as CfProState['slot'][];
          // MIRR has RI, RR, RESULT only (no I).
          const seq: CfProState['slot'][] = ['RI', 'RR', 'RESULT'];
          const i = seq.indexOf(state.slot);
          if (i >= 0) {
            const ni = action.dir === 'down' ? Math.min(seq.length - 1, i + 1) : Math.max(0, i - 1);
            state.slot = seq[ni];
          } else {
            state.slot = 'RI';
          }
          void order;
        } else if (state.sub === 'IRR') {
          state.slot = 'RESULT';
        } else {
          state.slot = state.slot === 'I' ? 'RESULT' : 'I';
        }
        entry.reset();
        return true;
      }
      if (action.kind === 'enter') {
        const v = entry.read();
        if (v !== null) {
          if (state.slot === 'I') state.discountRate = v;
          else if (state.slot === 'RI') state.financeRate = v;
          else if (state.slot === 'RR') state.reinvestRate = v;
        }
        entry.reset();
        return true;
      }
      if (action.kind === 'cpt') { compute(); return true; }
      if (action.kind === 'digit' || action.kind === 'decimal' || action.kind === 'sign') {
        if (state.slot !== 'RESULT') entry.push(action);
        return true;
      }
      if (action.kind === 'clear') { entry.reset(); return true; }
      return true;
    },
  };
};

// Convert MIRR initial slot to RI (since I is excluded for MIRR per TASK-179).
const _initSlot = (sub: CfProSubMode): 'I' | 'RI' | 'RESULT' =>
  sub === 'IRR' ? 'RESULT' : sub === 'MIRR' ? 'RI' : 'I';

// Re-export for tests if needed.
export { _initSlot };
