import { balanceAt, type AmortTvmState } from './bal';
export const principalPaid = (s: AmortTvmState, p1: number, p2: number): number => balanceAt(s, p1 - 1) - balanceAt(s, p2);
