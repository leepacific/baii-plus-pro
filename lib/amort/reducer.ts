export type AmortCell = 'P1'|'P2'|'BAL'|'PRN'|'INT';
export interface AmortState { P1: number; P2: number; focus: AmortCell }
export const AMORT_CELLS: AmortCell[] = ['P1','P2','BAL','PRN','INT'];
export const initialAmortState = (): AmortState => ({ P1: 1, P2: 1, focus: 'P1' });
export const moveAmortFocus = (state: AmortState, dir: 'up'|'down'): AmortState => {
  const i = AMORT_CELLS.indexOf(state.focus);
  return { ...state, focus: AMORT_CELLS[(i + (dir === 'down' ? 1 : -1) + AMORT_CELLS.length) % AMORT_CELLS.length] };
};
export const editAmort = (state: AmortState, value: number): AmortState => state.focus === 'P1' || state.focus === 'P2' ? { ...state, [state.focus]: value } : state;
