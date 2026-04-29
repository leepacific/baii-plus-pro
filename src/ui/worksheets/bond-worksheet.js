// PAGE-001 (`/`). BOND worksheet — TASK-183..189.
// 9-slot SDT, CPN, RDT, RV, ACT, 2/Y, YLD, PRI, AI; +DUR after CPT.
import { parseDateInput, formatDate } from '../../format/date-parse.js';
import { bondPrice } from '../../../lib/bond/price';
import { yieldNewton } from '../../../lib/bond/yield-newton';
import { accruedInterest } from '../../../lib/bond/accrued-interest';
import { modifiedDuration } from '../../../lib/bond/modified-duration';

const ORDER = ['SDT', 'CPN', 'RDT', 'RV', 'ACT', '2/Y', 'YLD', 'PRI', 'AI', 'DUR'];

const initialState = () => ({
  SDT: null, CPN: 0, RDT: null, RV: 100,
  dayCount: 'ACT', frequency: 2,
  YLD: null, PRI: null, AI: null, DUR: null,
  focus: 'SDT', error: null,
});

const advance = (cur, dir) => {
  const i = ORDER.indexOf(cur);
  const len = ORDER.length;
  const next = dir === 'down' ? (i + 1) % len : (i - 1 + len) % len;
  return ORDER[next];
};

const computeBond = (state) => {
  if (!state.SDT || !state.RDT) return { ...state, error: 4 };
  const bs = {
    SDT: new Date(Date.UTC(state.SDT.year, state.SDT.month - 1, state.SDT.day)),
    RDT: new Date(Date.UTC(state.RDT.year, state.RDT.month - 1, state.RDT.day)),
    CPN: state.CPN, RV: state.RV,
    dayCount: state.dayCount, frequency: state.frequency,
  };
  if (state.focus === 'YLD' && state.PRI != null) {
    const y = yieldNewton(bs, state.PRI);
    return { ...state, YLD: y, AI: accruedInterest(bs), DUR: modifiedDuration(bs, y) };
  }
  if (state.focus === 'PRI' && state.YLD != null) {
    const p = bondPrice(bs, state.YLD);
    return { ...state, PRI: p, AI: accruedInterest(bs), DUR: modifiedDuration(bs, state.YLD) };
  }
  return { ...state, error: 4 };
};

export const createBondWorksheet = () => {
  let state = initialState();
  let entryText = '';

  const view = () => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.focus };
    if (state.focus === 'SDT' || state.focus === 'RDT') {
      const d = state[state.focus];
      const text = entryText || (d ? formatDate(d) : '0.0000');
      return { primary: { kind: 'text', text }, label: state.focus };
    }
    if (state.focus === 'ACT') return { primary: { kind: 'text', text: state.dayCount }, label: 'ACT' };
    if (state.focus === '2/Y') return { primary: { kind: 'text', text: state.frequency === 2 ? '2/Y' : '1/Y' }, label: '2/Y' };
    const num = entryText ? Number(entryText) : null;
    if (num !== null && Number.isFinite(num)) return { primary: { kind: 'number', value: num }, label: state.focus };
    const v = state[state.focus];
    return { primary: { kind: 'number', value: v ?? 0 }, label: state.focus };
  };

  const press = (action) => {
    if (state.error && action.kind !== 'clear') state = { ...state, error: null };
    if (action.kind === 'arrow') {
      state = { ...state, focus: advance(state.focus, action.dir) };
      entryText = '';
      return true;
    }
    if (action.kind === 'set') {
      if (state.focus === 'ACT') state = { ...state, dayCount: state.dayCount === 'ACT' ? '360' : 'ACT' };
      else if (state.focus === '2/Y') state = { ...state, frequency: state.frequency === 2 ? 1 : 2 };
      return true;
    }
    if (action.kind === 'enter') {
      const v = entryText ? Number(entryText) : null;
      if (v !== null && Number.isFinite(v)) {
        if (state.focus === 'SDT' || state.focus === 'RDT') {
          const d = parseDateInput(v);
          if (!d) state = { ...state, error: 1 };
          else state = { ...state, [state.focus]: d };
        } else if (state.focus === 'CPN') state = { ...state, CPN: v };
        else if (state.focus === 'RV') state = { ...state, RV: v };
        else if (state.focus === 'YLD') state = { ...state, YLD: v };
        else if (state.focus === 'PRI') state = { ...state, PRI: v };
      }
      entryText = '';
      return true;
    }
    if (action.kind === 'cpt') { state = computeBond(state); return true; }
    if (action.kind === 'digit') { entryText += String(action.value); return true; }
    if (action.kind === 'decimal') {
      if (!entryText.includes('.')) entryText = (entryText || '0') + '.';
      return true;
    }
    if (action.kind === 'sign') {
      if (entryText.startsWith('-')) entryText = entryText.slice(1);
      else if (entryText) entryText = '-' + entryText;
      return true;
    }
    if (action.kind === 'clear') { entryText = ''; return true; }
    return true;
  };

  return { id: 'BOND', view, press };
};
