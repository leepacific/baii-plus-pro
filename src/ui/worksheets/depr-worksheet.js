// PAGE-001 (`/`). DEPR worksheet — TASK-190..194.
// 9 (10 with method) slots: method, LIF, M01, CST, SAL, YR, DEP, RBV, RDV.
// 2ND+SET on the method slot cycles SL → SYD → DB → DBX → SLF → DBF.
import { sl } from '../../../lib/depr/sl';
import { syd } from '../../../lib/depr/syd';
import { db } from '../../../lib/depr/db';
import { dbx } from '../../../lib/depr/dbx';
import { slf } from '../../../lib/depr/slf';
import { dbf } from '../../../lib/depr/dbf';

const ORDER = ['method', 'LIF', 'M01', 'CST', 'SAL', 'YR', 'DEP', 'RBV', 'RDV'];
const METHODS = ['SL', 'SYD', 'DB', 'DBX', 'SLF', 'DBF'];

const initial = () => ({
  method: 'SL', LIF: 0, M01: 1, DBP: 200, CST: 0, SAL: 0, YR: 1,
  DEP: 0, RBV: 0, RDV: 0, focus: 'method', error: null,
});

const advance = (cur, dir) => {
  const i = ORDER.indexOf(cur);
  const len = ORDER.length;
  const next = dir === 'down' ? (i + 1) % len : (i - 1 + len) % len;
  return ORDER[next];
};

const compute = (s) => {
  const { CST, SAL, LIF, DBP, M01, YR, method } = s;
  if (LIF <= 0) return { DEP: 0, RBV: CST, RDV: Math.max(0, CST - SAL) };
  if (method === 'SL') return sl(CST, SAL, LIF, YR);
  if (method === 'SYD') return syd(CST, SAL, LIF, YR);
  if (method === 'DB') return db(CST, SAL, LIF, DBP, YR);
  if (method === 'DBX') return dbx(CST, SAL, LIF, DBP, YR);
  if (method === 'SLF') return slf(CST, SAL, LIF, M01, YR);
  if (method === 'DBF') return dbf(CST, SAL, LIF, DBP, M01, YR);
  return { DEP: 0, RBV: CST, RDV: 0 };
};

export const createDeprWorksheet = () => {
  let state = initial();
  let entryText = '';

  const view = () => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: state.focus };
    if (state.focus === 'method') return { primary: { kind: 'text', text: state.method }, label: 'METH' };
    const num = entryText ? Number(entryText) : null;
    if (num !== null && Number.isFinite(num)) {
      return { primary: { kind: 'number', value: num }, label: state.focus };
    }
    return { primary: { kind: 'number', value: state[state.focus] ?? 0 }, label: state.focus };
  };

  const press = (action) => {
    if (state.error && action.kind !== 'clear') state = { ...state, error: null };
    if (action.kind === 'arrow') {
      state = { ...state, focus: advance(state.focus, action.dir) };
      // Refresh outputs each navigation
      const r = compute(state);
      state = { ...state, DEP: r.DEP, RBV: r.RBV, RDV: r.RDV };
      entryText = '';
      return true;
    }
    if (action.kind === 'set') {
      if (state.focus === 'method') {
        const i = METHODS.indexOf(state.method);
        state = { ...state, method: METHODS[(i + 1) % METHODS.length] };
      }
      return true;
    }
    if (action.kind === 'enter') {
      const v = entryText ? Number(entryText) : null;
      if (v !== null && Number.isFinite(v)) {
        if (state.focus === 'LIF') {
          if (v < 1 || v > 100) state = { ...state, error: 5 };
          else state = { ...state, LIF: v };
        } else if (state.focus === 'M01') {
          if (v < 1.0 || v > 12.99) state = { ...state, error: 5 };
          else state = { ...state, M01: v };
        } else if (state.focus === 'CST') state = { ...state, CST: v };
        else if (state.focus === 'SAL') {
          if (v > state.CST) state = { ...state, error: 5 };
          else state = { ...state, SAL: v };
        } else if (state.focus === 'YR') state = { ...state, YR: v };
      }
      entryText = '';
      const r = compute(state);
      state = { ...state, DEP: r.DEP, RBV: r.RBV, RDV: r.RDV };
      return true;
    }
    if (action.kind === 'cpt') {
      const r = compute(state);
      state = { ...state, DEP: r.DEP, RBV: r.RBV, RDV: r.RDV };
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

  return { id: 'DEPR', view, press };
};
