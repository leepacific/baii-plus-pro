export interface BondWorksheetState { SDT: Date|null; CPN: number; RDT: Date|null; RV: number; dayCount: 'ACT'|'360'; frequency: 1|2; YLD: number|null; PRI: number|null; AI: number|null; duration: number|null; focus: keyof Omit<BondWorksheetState, 'focus'> }
export const initialBondState = (): BondWorksheetState => ({ SDT: null, CPN: 0, RDT: null, RV: 100, dayCount: 'ACT', frequency: 2, YLD: null, PRI: null, AI: null, duration: null, focus: 'SDT' });
export const editBondField = (state: BondWorksheetState, field: BondWorksheetState['focus'], value: any): BondWorksheetState => ({ ...state, [field]: value });
export const toggleBondDayCount = (state: BondWorksheetState): BondWorksheetState => ({ ...state, dayCount: state.dayCount === 'ACT' ? '360' : 'ACT' });
export const toggleBondFrequency = (state: BondWorksheetState): BondWorksheetState => ({ ...state, frequency: state.frequency === 1 ? 2 : 1 });
