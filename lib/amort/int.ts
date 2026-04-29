import { type AmortTvmState } from './bal';
import { principalPaid } from './prn';
export const interestPaid = (s: AmortTvmState, p1: number, p2: number): number => (p2 - p1 + 1) * s.PMT - principalPaid(s, p1, p2);
