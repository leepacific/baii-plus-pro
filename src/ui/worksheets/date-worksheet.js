// PAGE-001 (`/`). DATE worksheet — TASK-195..198. 4-slot DT1, DT2, DBD, ACT.
import { parseDateInput, formatDate } from '../../format/date-parse.js';
import { computeDbd, solveDate } from '../../../lib/date/cpt';

const ORDER = ['DT1', 'DT2', 'DBD', 'ACT'];

const initial = () => ({
  DT1: null, DT2: null, DBD: null, mode: 'ACT',
  focus: 'DT1', error: null,
});

const advance = (cur, dir) => {
  const i = ORDER.indexOf(cur);
  const len = ORDER.length;
  const next = dir === 'down' ? (i + 1) % len : (i - 1 + len) % len;
  return ORDER[next];
};

export const createDateWorksheet = () => {
  let state = initial();
  let entryText = '';

  const view = () => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.focus };
    if (state.focus === 'DT1' || state.focus === 'DT2') {
      const d = state[state.focus];
      const text = entryText || (d ? formatDate(d) : '0.0000');
      return { primary: { kind: 'text', text }, label: state.focus };
    }
    if (state.focus === 'ACT') return { primary: { kind: 'text', text: state.mode }, label: 'ACT' };
    const num = entryText ? Number(entryText) : null;
    if (num !== null && Number.isFinite(num)) return { primary: { kind: 'number', value: num }, label: 'DBD' };
    return { primary: { kind: 'number', value: state.DBD ?? 0 }, label: 'DBD' };
  };

  const press = (action) => {
    if (state.error && action.kind !== 'clear') state = { ...state, error: null };
    if (action.kind === 'arrow') {
      state = { ...state, focus: advance(state.focus, action.dir) };
      entryText = '';
      return true;
    }
    if (action.kind === 'set') {
      if (state.focus === 'ACT') state = { ...state, mode: state.mode === 'ACT' ? '360' : 'ACT' };
      return true;
    }
    if (action.kind === 'enter') {
      const v = entryText ? Number(entryText) : null;
      if (v !== null && Number.isFinite(v)) {
        if (state.focus === 'DT1' || state.focus === 'DT2') {
          const d = parseDateInput(v);
          if (!d) state = { ...state, error: 1 };
          else state = { ...state, [state.focus]: d };
        } else if (state.focus === 'DBD') state = { ...state, DBD: v };
      }
      entryText = '';
      return true;
    }
    if (action.kind === 'cpt') {
      if (state.focus === 'DBD' && state.DT1 && state.DT2) {
        state = { ...state, DBD: computeDbd(state.DT1, state.DT2, state.mode) };
      } else if (state.focus === 'DT2' && state.DT1 && state.DBD != null) {
        const r = solveDate({ DT1: state.DT1, DBD: state.DBD, mode: state.mode });
        if (r.DT2) state = { ...state, DT2: r.DT2 };
      } else if (state.focus === 'DT1' && state.DT2 && state.DBD != null) {
        const r = solveDate({ DT2: state.DT2, DBD: state.DBD, mode: state.mode });
        if (r.DT1) state = { ...state, DT1: r.DT1 };
      } else {
        state = { ...state, error: 4 };
      }
      return true;
    }
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

  return { id: 'DATE', view, press };
};
