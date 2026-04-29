import { KeyId } from '../../keypad/key-id';
import { type ArithOperator, type EngineState } from '../state';
const digitFor = (key: KeyId): string | null => key.startsWith('D') && key.length === 2 ? key.slice(1) : null;
const apply = (a: number, op: ArithOperator | null, b: number): number => {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b === 0 ? Number.NaN : a / b;
  if (op === '^') return a ** b;
  return b;
};
const setUnary = (state: EngineState, value: number): EngineState =>
  Number.isFinite(value)
    ? { ...state, display: { ...state.display, value, entry: String(value), justEvaluated: true } }
    : { ...state, error: 2 };
export const reduceStandard = (state: EngineState, key: KeyId): EngineState => {
  if (state.error && key !== KeyId.CE_C) return state;
  if (key === KeyId.CE_C) return { ...state, error: null, display: { value: 0, entry: '0', pendingOperator: null, accumulator: null, justEvaluated: false } };
  const digit = digitFor(key);
  if (digit !== null) {
    const entry = state.display.justEvaluated || state.display.entry === '0' ? digit : state.display.entry + digit;
    return { ...state, display: { ...state.display, entry, value: Number(entry), justEvaluated: false } };
  }
  if (key === KeyId.DECIMAL) {
    const entry = state.display.entry.includes('.') ? state.display.entry : `${state.display.entry}.`;
    return { ...state, display: { ...state.display, entry, value: Number(entry) } };
  }
  if (key === KeyId.SIGN) {
    const value = -state.display.value;
    return { ...state, display: { ...state.display, value, entry: String(value) } };
  }
  // Unary primary scientific keys.
  if (key === KeyId.SQRT) {
    const x = state.display.value;
    if (x < 0) return { ...state, error: 2 };
    return setUnary(state, Math.sqrt(x));
  }
  const op = ({ [KeyId.PLUS]: '+', [KeyId.MINUS]: '-', [KeyId.MULTIPLY]: '*', [KeyId.DIVIDE]: '/', [KeyId.POWER]: '^' } as Partial<Record<KeyId, ArithOperator>>)[key];
  if (op) {
    const accumulator = state.display.accumulator === null ? state.display.value : apply(state.display.accumulator, state.display.pendingOperator, state.display.value);
    if (!Number.isFinite(accumulator)) return { ...state, error: 2 };
    return { ...state, display: { ...state.display, value: accumulator, entry: '0', accumulator, pendingOperator: op, justEvaluated: false } };
  }
  if (key === KeyId.EQUALS) {
    const value = state.display.accumulator === null ? state.display.value : apply(state.display.accumulator, state.display.pendingOperator, state.display.value);
    if (!Number.isFinite(value)) return { ...state, error: 2 };
    return { ...state, display: { ...state.display, value, entry: String(value), accumulator: null, pendingOperator: null, justEvaluated: true } };
  }
  // Grouping: ( pushes the current accumulator/operator; ) collapses one frame.
  if (key === KeyId.LPAREN) {
    const stack = state.display.parenStack ? [...state.display.parenStack] : [];
    stack.push({ accumulator: state.display.accumulator, pendingOperator: state.display.pendingOperator });
    return { ...state, display: { ...state.display, accumulator: null, pendingOperator: null, value: 0, entry: '0', justEvaluated: false, parenStack: stack } };
  }
  if (key === KeyId.RPAREN) {
    const stack = state.display.parenStack ? [...state.display.parenStack] : [];
    if (stack.length === 0) return state;
    const inner = state.display.accumulator === null ? state.display.value : apply(state.display.accumulator, state.display.pendingOperator, state.display.value);
    if (!Number.isFinite(inner)) return { ...state, error: 2 };
    const frame = stack.pop()!;
    return { ...state, display: { ...state.display, value: inner, entry: String(inner), accumulator: frame.accumulator, pendingOperator: frame.pendingOperator, justEvaluated: true, parenStack: stack } };
  }
  return state;
};
