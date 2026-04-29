// PAGE-001 (`/`). CF Pro entry slots — TASK-179, TASK-180.
// I (discount), RI (finance), RR (reinvest) entry validation.
import type { CfProState } from './cf-pro-mode';

export interface CfProEntryResult {
  state: CfProState;
}

export const commitCfProEntry = (state: CfProState, value: number | null): CfProEntryResult => {
  if (value == null) return { state };
  if (state.slot === 'I') return { state: { ...state, discountRate: value } };
  if (state.slot === 'RI') return { state: { ...state, financeRate: value } };
  if (state.slot === 'RR') return { state: { ...state, reinvestRate: value } };
  return { state };
};
