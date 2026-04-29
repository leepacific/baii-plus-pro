export interface BondState { SDT: Date; CPN: number; RDT: Date; RV: number; dayCount: 'ACT'|'360'; frequency: 1|2 }
export const accruedInterest = (s: BondState): number => s.RV * (s.CPN / 100) / s.frequency * 0.5;
