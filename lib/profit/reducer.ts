export interface ProfitState { CST: number; SEL: number; MAR: number }
export const initialProfitState = (): ProfitState => ({ CST: 0, SEL: 0, MAR: 0 });
export const editProfitField = (state: ProfitState, field: keyof ProfitState, value: number): ProfitState => ({ ...state, [field]: value });
