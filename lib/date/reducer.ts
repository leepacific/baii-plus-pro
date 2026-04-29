import { type CalcDate } from './parse';
export interface DateWorksheetState { DT1: CalcDate|null; DT2: CalcDate|null; DBD: number|null; mode: 'ACT'|'360'; focus: 'DT1'|'DT2'|'DBD' }
export const initialDateWorksheet = (): DateWorksheetState => ({ DT1: null, DT2: null, DBD: null, mode: 'ACT', focus: 'DT1' });
export const editDateField = (state: DateWorksheetState, value: CalcDate | number): DateWorksheetState => ({ ...state, [state.focus]: value } as DateWorksheetState);
