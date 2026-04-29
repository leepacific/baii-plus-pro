export type DeprMethod = 'SL'|'SYD'|'DB'|'DBX'|'SLF'|'DBF';
export interface DeprState { LIF: number; M01: number; DBP: number; CST: number; SAL: number; YR: number; DEP: number; RBV: number; RDV: number; method: DeprMethod }
export const initialDeprState = (): DeprState => ({ LIF: 0, M01: 1, DBP: 200, CST: 0, SAL: 0, YR: 1, DEP: 0, RBV: 0, RDV: 0, method: 'SL' });
export const editDeprField = (state: DeprState, field: keyof DeprState, value: number | DeprMethod): DeprState => ({ ...state, [field]: value } as DeprState);
