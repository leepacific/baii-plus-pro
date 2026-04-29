// PAGE-001 (`/`). STAT worksheet — TASK-199..203.
// Two phases: data-entry (X01..X50, Y01..Y50) and computation (mode + outputs).
import { computeN } from '../../../lib/stat/1var/n';
import { computeMean } from '../../../lib/stat/1var/mean';
import { computeSx } from '../../../lib/stat/1var/sx';
import { computeSigmaX } from '../../../lib/stat/1var/sigma-x';
import { computeSumX } from '../../../lib/stat/1var/sum-x';
import { computeSumX2 } from '../../../lib/stat/1var/sum-x2';
import { computeLIN } from '../../../lib/stat/2var/lin';
import { computeLn } from '../../../lib/stat/2var/ln';
import { computeEXP } from '../../../lib/stat/2var/exp';
import { computePWR } from '../../../lib/stat/2var/pwr';
import { predictX } from '../../../lib/stat/2var/predict-x';
import { predictY } from '../../../lib/stat/2var/predict-y';

const REG_MODES = ['1-V', 'LIN', 'Ln', 'EXP', 'PWR'];
const ONE_V_OUTPUTS = ['n', 'mean', 'Sx', 'σx', 'ΣX', 'ΣX2'];
const TWO_V_OUTPUTS = ['a', 'b', 'r', 'y\'', 'x\''];

const initial = () => ({
  phase: 'DATA',  // 'DATA' | 'COMP'
  X: Array.from({ length: 50 }, () => null),
  Y: Array.from({ length: 50 }, () => null),
  cursor: 0,
  axis: 'X',     // 'X' | 'Y'
  mode: '1-V',
  outputCursor: 0,
  predictX: null,
  predictY: null,
  predictResult: null,
  error: null,
});

const advance2D = (state, dir) => {
  // X(n) → Y(n) → X(n+1)
  if (dir === 'down') {
    if (state.axis === 'X') return { ...state, axis: 'Y' };
    return { ...state, axis: 'X', cursor: Math.min(49, state.cursor + 1) };
  }
  if (state.axis === 'Y') return { ...state, axis: 'X' };
  return { ...state, axis: 'Y', cursor: Math.max(0, state.cursor - 1) };
};

const dataLabel = (s) => `${s.axis}${String(s.cursor + 1).padStart(2, '0')}`;

const pairs2 = (X, Y) => X.map((x, i) => ({ x, y: Y[i] })).filter(p => p.x != null && p.y != null);

const oneVarOutput = (output, X, Y) => {
  const ss = X.map((x, i) => ({ x, y: Y[i] ?? 1 }));
  if (output === 'n') return computeN(ss);
  if (output === 'mean') return computeMean(ss);
  if (output === 'Sx') return computeSx(ss);
  if (output === 'σx') return computeSigmaX(ss);
  if (output === 'ΣX') return computeSumX(ss);
  if (output === 'ΣX2') return computeSumX2(ss);
  return 0;
};

const twoVarFit = (mode, ss) => {
  const ps = ss.filter(s => s.x != null && s.y != null);
  if (mode === 'LIN') return computeLIN(ps.map(p => ({ x: p.x, y: p.y })));
  if (mode === 'Ln') return computeLn(ps.map(p => ({ x: p.x, y: p.y })));
  if (mode === 'EXP') return computeEXP(ps.map(p => ({ x: p.x, y: p.y })));
  if (mode === 'PWR') return computePWR(ps.map(p => ({ x: p.x, y: p.y })));
  return { a: 0, b: 0, r: 0 };
};

export const createStatWorksheet = () => {
  let state = initial();
  let entryText = '';

  const view = () => {
    if (state.error) return { primary: { kind: 'error', code: state.error }, label: 'STAT' };
    if (state.phase === 'DATA') {
      const idx = state.cursor;
      const stored = state.axis === 'X' ? state.X[idx] : state.Y[idx];
      const num = entryText ? Number(entryText) : null;
      if (num !== null && Number.isFinite(num)) return { primary: { kind: 'number', value: num }, label: dataLabel(state) };
      return { primary: { kind: 'number', value: stored ?? 0 }, label: dataLabel(state) };
    }
    // COMP phase
    if (state.outputCursor === 0) return { primary: { kind: 'text', text: state.mode }, label: 'MODE' };
    const slots = state.X.map((x, i) => ({ x, y: state.Y[i] ?? 1 }));
    if (state.mode === '1-V') {
      const o = ONE_V_OUTPUTS[state.outputCursor - 1] ?? 'n';
      return { primary: { kind: 'number', value: oneVarOutput(o, state.X, state.Y) }, label: o };
    }
    // 2-V
    const fit = twoVarFit(state.mode, slots);
    const out = TWO_V_OUTPUTS[state.outputCursor - 1] ?? 'a';
    if (out === 'a') return { primary: { kind: 'number', value: fit.a }, label: 'a' };
    if (out === 'b') return { primary: { kind: 'number', value: fit.b }, label: 'b' };
    if (out === 'r') return { primary: { kind: 'number', value: fit.r }, label: 'r' };
    if (out === "y'") {
      const num = entryText ? Number(entryText) : null;
      if (num !== null && Number.isFinite(num)) return { primary: { kind: 'number', value: num }, label: "y'" };
      return { primary: { kind: 'number', value: state.predictResult ?? 0 }, label: "y'" };
    }
    if (out === "x'") {
      const num = entryText ? Number(entryText) : null;
      if (num !== null && Number.isFinite(num)) return { primary: { kind: 'number', value: num }, label: "x'" };
      return { primary: { kind: 'number', value: state.predictResult ?? 0 }, label: "x'" };
    }
    return { primary: { kind: 'number', value: 0 }, label: out };
  };

  const press = (action) => {
    if (state.error && action.kind !== 'clear') state = { ...state, error: null };

    if (action.kind === 'set') {
      // Cycle regression mode in COMP phase, mode slot
      if (state.phase === 'COMP' && state.outputCursor === 0) {
        const i = REG_MODES.indexOf(state.mode);
        state = { ...state, mode: REG_MODES[(i + 1) % REG_MODES.length] };
      }
      return true;
    }

    if (action.kind === 'arrow') {
      if (state.phase === 'DATA') {
        state = advance2D(state, action.dir);
      } else {
        const max = state.mode === '1-V' ? ONE_V_OUTPUTS.length : TWO_V_OUTPUTS.length;
        const cur = state.outputCursor;
        const next = action.dir === 'down' ? Math.min(max, cur + 1) : Math.max(0, cur - 1);
        state = { ...state, outputCursor: next };
      }
      entryText = '';
      return true;
    }

    if (action.kind === 'enter') {
      const v = entryText ? Number(entryText) : null;
      if (state.phase === 'DATA' && v !== null && Number.isFinite(v)) {
        if (state.axis === 'X') {
          const X = [...state.X]; X[state.cursor] = v;
          state = { ...state, X };
        } else {
          const Y = [...state.Y]; Y[state.cursor] = v;
          state = { ...state, Y };
        }
      }
      entryText = '';
      return true;
    }

    if (action.kind === 'cpt') {
      if (state.phase === 'COMP' && state.mode !== '1-V') {
        const out = TWO_V_OUTPUTS[state.outputCursor - 1];
        const slots = pairs2(state.X, state.Y);
        if (out === "y'" && state.predictX != null) {
          state = { ...state, predictResult: predictY(slots, state.mode, state.predictX) };
        } else if (out === "x'" && state.predictY != null) {
          state = { ...state, predictResult: predictX(slots, state.mode, state.predictY) };
        }
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

  // Public switch to enter DATA / COMP phase from the controller layer.
  const setPhase = (phase) => { state = { ...state, phase, outputCursor: 0 }; entryText = ''; };

  return { id: 'STAT', view, press, setPhase, getState: () => state };
};
