import { type FormatState, type DecimalPlaces } from './state';
const cycle: DecimalPlaces[] = [0,1,2,3,4,5,6,7,8,9,'FLOAT'];
export const cycleDecimalPlaces = (state: FormatState): FormatState => {
  const current = cycle.indexOf(state.decimalPlaces);
  return { ...state, decimalPlaces: cycle[(current + 1) % cycle.length] };
};
