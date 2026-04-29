export interface BreakevenState { FC: number; VC: number; P: number; PFT: number; Q: number }
export const initialBreakevenState = (): BreakevenState => ({ FC: 0, VC: 0, P: 0, PFT: 0, Q: 0 });
export const editBreakevenField = (state: BreakevenState, field: keyof BreakevenState, value: number): BreakevenState => ({ ...state, [field]: value });
