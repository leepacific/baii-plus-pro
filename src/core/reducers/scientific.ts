import { type EngineState } from '../state';
import { type SecondaryFunction } from '../../keypad/secondary-function-map';
export const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);
export const reduceScientific = (state: EngineState, fn: SecondaryFunction): EngineState => {
  const x = state.display.value;
  const invalid = (): EngineState => ({ ...state, error: 2 });
  const set = (value: number): EngineState => Number.isFinite(value) ? { ...state, display: { ...state.display, value, entry: String(value), justEvaluated: true } } : invalid();
  switch (fn) {
    case 'SQUARE': return set(x * x);
    case 'RECIPROCAL': return x === 0 ? invalid() : set(1 / x);
    case 'LN': return x <= 0 ? invalid() : set(Math.log(x));
    case 'EXP': return set(Math.exp(x));
    case 'LOG': return x <= 0 ? invalid() : set(Math.log10(x));
    case 'TEN_X': return set(10 ** x);
    case 'FACTORIAL': return x < 0 || !Number.isInteger(x) ? invalid() : set(factorial(x));
    default: return state;
  }
};
export const sqrtOp = (state: EngineState): EngineState => state.display.value < 0 ? { ...state, error: 2 } : { ...state, display: { ...state.display, value: Math.sqrt(state.display.value), entry: String(Math.sqrt(state.display.value)) } };
export const powerOp = (base: number, exponent: number): number => base ** exponent;
