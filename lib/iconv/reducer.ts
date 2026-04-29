export interface IconvState { NOM: number; EFF: number; CY: number }
export const initialIconvState = (): IconvState => ({ NOM: 0, EFF: 0, CY: 1 });
export const editIconvField = (state: IconvState, field: keyof IconvState, value: number): IconvState => ({ ...state, [field]: value });
