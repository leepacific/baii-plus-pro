// PAGE-001 (`/`). AMORT P1/P2 commit + validation — TASK-171, TASK-172.
import type { AmortViewState } from './amort-mode';

export interface AmortEntryResult {
  P1: number;
  P2: number;
  error?: 4;
}

export const commitAmortEntry = (state: AmortViewState, value: number | null): AmortEntryResult => {
  let { P1, P2 } = state;
  if (value === null) return { P1, P2 };
  if (state.focus === 'P1') {
    if (!Number.isInteger(value) || value < 1) return { P1, P2, error: 4 };
    P1 = value;
    if (P2 < P1) P2 = P1;
    return { P1, P2 };
  }
  if (state.focus === 'P2') {
    if (!Number.isInteger(value) || value < state.P1) return { P1, P2, error: 4 };
    P2 = value;
    return { P1, P2 };
  }
  return { P1, P2 };
};
